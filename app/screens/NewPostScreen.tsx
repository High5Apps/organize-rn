import React, { useState } from 'react';
import { MultilineTextInput, ScreenBackground, TextInputRow } from '../components';

const MAX_TITLE_LENGTH = 120;
const MAX_BODY_LENGTH = 10000;

export default function NewPostScreen() {
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');

  return (
    <ScreenBackground>
      <TextInputRow
        maxLength={MAX_TITLE_LENGTH}
        onChangeText={setTitle}
        placeholder="Title"
        value={title}
      />
      <MultilineTextInput
        maxLength={MAX_BODY_LENGTH}
        onChangeText={setBody}
        placeholder="Body (optional)"
        value={body}
      />
    </ScreenBackground>
  );
}
