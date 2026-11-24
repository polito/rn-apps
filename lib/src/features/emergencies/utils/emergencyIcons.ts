import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faCircleExclamation,
  faCircleRadiation,
  faHouseCrack,
  faHouseFire,
  faPeopleRobbery,
  faPersonWalkingArrowRight,
  faTruckMedical,
} from '@fortawesome/free-solid-svg-icons';

const emergencyIcons: Record<string, IconDefinition> = {
  faCircleRadiation,
  faHouseCrack,
  faHouseFire,
  faPeopleRobbery,
  faPersonWalkingArrowRight,
  faTruckMedical,
};

export const getEmergencyIcon = (icon: string) =>
  emergencyIcons[icon] ?? faCircleExclamation;
