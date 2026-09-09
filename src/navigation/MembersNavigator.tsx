import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MembersStackParamList } from './types';
import { MemberListScreen } from '../screens/members/MemberListScreen';
import { AddEditMemberScreen } from '../screens/members/AddEditMemberScreen';
import { MemberDetailScreen } from '../screens/members/MemberDetailScreen';

const Stack = createNativeStackNavigator<MembersStackParamList>();

export const MembersNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="MemberList"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MemberList" component={MemberListScreen} />
      <Stack.Screen name="AddEditMember" component={AddEditMemberScreen} />
      <Stack.Screen name="MemberDetail" component={MemberDetailScreen} />
    </Stack.Navigator>
  );
};
