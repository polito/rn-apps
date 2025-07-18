import { TouchableHighlightProps } from 'react-native';
 
 import { DirectoryListItem } from '../../ui/components/DirectoryListItem';
 import { useNavigation } from '@react-navigation/native';
 import { NativeStackNavigationProp } from '@react-navigation/native-stack';
 
 import { TeachingStackParamList } from './TeachingNavigator';
import { useCourses } from '../../core/contexts/CoursesContext';
import React from 'react';
 
 interface Props {
   name : string,
   length : number,
   showDirFiles: boolean;
   setShowDirFiles: React.Dispatch<React.SetStateAction<boolean>>;
   dirId : number;
   setDirId : React.Dispatch<React.SetStateAction<number>>;
 }
     const { fakeCourses, fakeExams, selectedCourse, managedCourses} = useCourses(); // Usa il hook per ottenere i dati
 
 export const CourseDirectoryListItem = ({
   name,
   length,
   showDirFiles,
   setShowDirFiles,
   dirId,
   setDirId,
   ...rest
 }: Omit<TouchableHighlightProps, 'onPress'> & Props) => {
   const navigation =
     useNavigation<NativeStackNavigationProp<TeachingStackParamList, any>>();
   return (


    
     <DirectoryListItem
       title={name}
       subtitle={`${length} files`}
       onPress={() =>{
        setShowDirFiles(true)
        setDirId(dirId)
       }
         
         
       }
       {...rest}
     />
   );
 };