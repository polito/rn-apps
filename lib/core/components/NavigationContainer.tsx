import { navigationIntegration } from '@lib/core/utils/sentry';
import {
  ParamListBase,
  NavigationContainer as ReactNavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';

type NavigationContainerPropsTyped<T extends ParamListBase> = Omit<
  React.ComponentProps<typeof ReactNavigationContainer>,
  'linking'
> & {
  linking?: React.ComponentProps<typeof ReactNavigationContainer<T>>['linking'];
};

export const NavigationContainer = <T extends ParamListBase = ParamListBase>({
  children,
  ...rest
}: NavigationContainerPropsTyped<T>) => {
  const navigationRef = useNavigationContainerRef<T>();

  return (
    <ReactNavigationContainer<T>
      ref={navigationRef as any}
      onReady={() => {
        // Register the navigation container with the instrumentation
        navigationIntegration.registerNavigationContainer(navigationRef);
      }}
      {...rest}
    >
      {children}
    </ReactNavigationContainer>
  );
};
