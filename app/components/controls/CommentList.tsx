import React from 'react';
import { FlatList } from 'react-native';
import CommentRow from './CommentRow';

export default function CommentList() {
  return <FlatList data={[]} renderItem={() => <CommentRow />} />;
}
