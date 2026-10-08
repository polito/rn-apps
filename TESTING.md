# Testing

Our tests are integration tests. We render the whole `App`, mock the network with [MSW](https://mswjs.io/) and navigate like a user would with [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) (RNTL).

Tests live in `students/__tests__` and `faculty/__tests__`.

## Running tests

```sh
npm test # both apps tests
npm test --workspace=students # one app
npm test --workspace=students -- CoursesScreen # one file
npm run test:check # what CI runs
```

Both `students/` and `faculty/` have their own jest.config.js and jest.setup.ts. The following is a short summary of both. Both `jest.setup.ts` use a shared base setup. We don't do this for `jest.config.js` because they differ and it would complicate the use of different `jest.setup.ts`.

## jest.config.js

- `preset: 'react-native'` gives us the RN environment.
- `setupFiles` runs before the test framework is installed. Some libraries ship a jest setup file that has to go here (for example `@react-native-documents/picker` in students).
- `setupFilesAfterEnv` runs our `jest.setup.ts` and library setups that need jest globals (`@rnmapbox/maps`).
- `transformIgnorePatterns` lists the packages in `node_modules` that ship untranspiled code and need to go through babel. If a test fails with `SyntaxError: Cannot use import statement outside a module` or `Unexpected token` coming from a package, add that package to the list.

## jest.setup.ts

Inside each app `jest.setup.ts` starts by importing `lib/src/testing/jest.setup.ts`. This is the shared setup. The rest of the app file are specific mocks and the MSW server hooks.

- `configure({ asyncUtilTimeout: 5000 })`: the app takes a while to boot, so `findBy` waits up to 5 seconds.
- **React Query timers**: we `unref` React Query timers so pending gc timers don't keep jest alive after the tests end.
- **`notifyManager.setScheduler(queueMicrotask)`**: React Query delivers cache updates to components from a `setTimeout(0)`. That update can land outside `act`. With a microtask the update stays in the same tick as the change that caused it. This way it's covered by the RNTL call.
- **Imported mocks**: libraries that ship their own jest mock (netinfo, localize, permissions, device info, async storage, safe area). We just wire them up.
- **Manual mocks**: libraries that don't ship a mock. These are minimal and only cover what the app calls during our tests.
- **lib mocks**:
  `Grid` from lib (layout issue) and `initSentry` / `Sentry` from `@polito/lib/core`, so `App.tsx` runs without Sentry.
- **Hooks**: before each test we reset the keychain mock and AsyncStorage. Students also sets `lastInstalledVersion` to the current app version (to avoid migrations). The MSW server starts once per file with `onUnhandledRequest: 'error'` and handlers are reset after each test.

### Maintaining manual mocks

When a test reaches new code, a manual mock may be missing something. You'll usually see `X is not a function` or `Cannot read properties of undefined` coming from a native library. Add the missing function to the mock (in lib or in the app `jest.setup.ts`) and return the most boring value possible (`null`, `false`, an empty array, a resolved promise). If the library ships a mock in a new version, move it to the imported mocks section.

## Mocking the API

The MSW server is in `src/testing/msw/server.ts`. It starts with `commonRoutes`, the routes almost every screen calls on boot (courses, exams, notifications, career, sites, ...). If every test needs a route, add it there. Otherwise add it in the test file with `server.use(...)`. Routes added with `server.use` take precedence. A test can override a common route by specifying a route.

We keep `onUnhandledRequest: 'error'` to stop any request without a handler and log to console.

### mockRoute

`mockRoute(path, options)` returns an MSW handler. Both apps call the same API, so it is shared in `lib/src/testing/utils/mockRoute.ts`: import it from `@polito/lib/testing/utils/mockRoute`.

```ts
mockRoute('/v2/courses'); // spec example
mockRoute<Course>('/courses/{courseId}', {
  body: { data: WEB_APPS_II_DETAIL },
});
mockRoute('/exams', { body: { data: [] } }); // empty state
mockRoute('/student/tickets', { status: 500 }); // error
mockRoute('/student/tickets', {
  status: 500,
  body: { message: 'Tickets unavailable' },
}); // error with a custom message
mockRoute('/courses/{courseId}', { params: { courseId: 1 } }); // one id only
```

- `path` is written like in the OpenAPI spec. `{params}` match any value unless you pass them in `options.params`.
- Without `body`, the response is the `200` example from the OpenAPI spec of `@polito/student-api-client`. It throws if the spec has no example for that route.
- Error statuses accept a `{ code, message }` body. In students every failed query shows an `Alert` and logs `console.error`.
- `method` defaults to `get`.

### Examples vs constants

Use the spec example when you just need the screen to load. Use a constant from `src/testing/constants.ts` when the spec has no example (like `TEST_TEACHER`) or when the test asserts on specific values. Assert using the constant itself (`screen.findByText(WEB_APPS_II_DETAIL.name)`), so data and assertion stay in sync.

Most faculty screens still read from in-memory fixtures in `CoursesContext`, so most faculty constants point to rows of that context instead of API responses. The exception is the course list on the Teaching home, which comes from `GET /v2/courses` (`TEST_API_COURSE`).

## Auth

In both apps, `react-native-keychain` is replaced by `lib/src/testing/mocks/keychain.ts`, which keeps credentials in memory. Import it from `@polito/lib/testing/mocks/keychain`.

- `__seedCredentials({ username, password })` logs the user in. It also writes `username` to AsyncStorage because the app reads it from there.
- Credentials are reset before each test. If you don't seed, the app starts on the login screen.

## Seeding in beforeEach

Put what every test in a `describe` needs in `beforeEach`: credentials and routes.

```ts
describe('Ticket flow', () => {
  beforeEach(() => {
    __seedCredentials({ username: 's123456', password: 'fake-password' });
    server.use(
      mockRoute<TicketOverview[]>('/student/tickets', {
        body: { data: [TEST_TICKET_OVERVIEW] },
      }),
    );
  });

  it('shows the ticket details', async () => {
    await render(<App />);
    // ...
  });
});
```

## Writing a test

1. `await render(<App />)`. With seeded credentials you start on the home screen.
2. Navigate like a user. Always `await` `render` and `fireEvent`, they are async in RNTL 14.
3. Assert on what the user sees.

```ts
it('pressing Ticket shows the open tickets', async () => {
  await render(<App />);

  await fireEvent.press(
    await screen.findByRole('button', { name: /Services, tab/ }),
  );
  await fireEvent.press(await screen.findByText('Ticket'));

  expect(await screen.findByText('My tickets')).toBeOnTheScreen();
  // the list loads after the header, so findBy again
  expect(await screen.findByText('Library card renewal')).toBeOnTheScreen();
});
```

Which query to use ([queries docs](https://testing-library.com/docs/queries/about/)):

- `findBy...` for anything that shows up after async work (navigation, API calls). It waits and retries.
- `getBy...` for things already on screen, for example right after a `findBy` on the same screen.
- `queryBy...` only to check that something is **not** there (`expect(screen.queryByText('x')).toBeNull()`).
- Prefer `ByRole` and `ByText`, they match what the user sees.

If many tests repeat the same navigation, write a small helper (see `openCourse` in `faculty/__tests__/CourseScreen.flow.test.tsx`).

Other utils in `src/testing/utils`: `mockConfirmAlert(message)` presses the first button of an `Alert` with that message, `buildCourseDetail` builds a course detail from a course overview.

## Console output

Running the tests prints `console.warn` messages even if everything passes.
These console outputs give useful information.

- `console.warn` comes from the app. It warns about deprecations or about excessive rerenders. They point at things worth looking at in the app.

For a quiet run pass `--silent`, for example `npm test --workspace=students -- --silent`.

## Common problems

- **act warnings**: usually a missing `await` on `render` or `fireEvent`.
- **`Unhandled request` error**: the screen calls a route you didn't mock. Add it with `server.use` or to `commonRoutes`.
- **`Unexpected end of JSON input`**: an error response reached the students app without a JSON body.
