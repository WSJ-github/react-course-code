import React from 'react';
import type { Preview } from "@storybook/react";
import { Title, Subtitle, Description, Primary, Controls, Stories } from '@storybook/blocks';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" }, // 匹配事件
    controls: {
      matchers: {
        color: /(background|color)$/i, // 匹配颜色
        date: /Date$/i, // 匹配日期
      },
    },
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls />
          <Stories />
        </>
      ),
    },
  },
};

export default preview;
