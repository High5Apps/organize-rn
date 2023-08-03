import React, { useState } from 'react';
import { ScreenBackground, TextInputRow } from '../components';

const MAX_TITLE_LENGTH = 120;

export default function NewPostScreen() {
  const [title, setTitle] = useState('');

  return (
    <ScreenBackground>
      <TextInputRow
        maxLength={MAX_TITLE_LENGTH}
        onChangeText={setTitle}
        placeholder="Title"
        value={title}
      />
    </ScreenBackground>
  );
}
