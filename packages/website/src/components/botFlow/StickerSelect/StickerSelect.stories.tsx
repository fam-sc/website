import type { Meta, StoryObj } from '@storybook/react';

import { StickerSelect } from '.';

export default {
  component: StickerSelect,
} satisfies Meta<typeof StickerSelect>;

type Story = StoryObj<typeof StickerSelect>;

export const Primary: Story = {
  args: {
    stickers: [
      'bot-flow/tg-sticker/5434144690511290129.webp',
      'bot-flow/tg-sticker/5312536423851630001.webp',
      'bot-flow/tg-sticker/5312016608254762256.webp',
      'bot-flow/tg-sticker/5377544228505134960.webp',
      'bot-flow/tg-sticker/5418085807791545980.webp',
      'bot-flow/tg-sticker/5370870893004203704.webp',
      'bot-flow/tg-sticker/5420216386448270341.webp',
      'bot-flow/tg-sticker/5379748062124056162.webp',
      'bot-flow/tg-sticker/5373251851074415873.webp',
      'bot-flow/tg-sticker/5433614043006903194.webp',
      'bot-flow/tg-sticker/5357315181649076022.webp',
      'bot-flow/tg-sticker/5309965701241379366.webp',
      'bot-flow/tg-sticker/5309984423003823246.webp',
      'bot-flow/tg-sticker/5312241539987020022.webp',
      'bot-flow/tg-sticker/5312138559556164615.webp',
      'bot-flow/tg-sticker/5377316857231450742.webp',
      'bot-flow/tg-sticker/5350305691942788490.webp',
      'bot-flow/tg-sticker/5350713563512052787.webp',
      'bot-flow/tg-sticker/5309958691854754293.webp',
      'bot-flow/tg-sticker/5350452584119279096.webp',
      'bot-flow/tg-sticker/5309929258443874898.webp',
      'bot-flow/tg-sticker/5377690785674175481.webp',
      'bot-flow/tg-sticker/5310107765874632305.webp',
      'bot-flow/tg-sticker/5377438129928020693.webp',
      'bot-flow/tg-sticker/5309950797704865693.webp',
      'bot-flow/tg-sticker/5350554349074391003.webp',
      'bot-flow/tg-sticker/5409357944619802453.webp',
      'bot-flow/tg-sticker/5312322066328853156.webp',
      'bot-flow/tg-sticker/5312486108309757006.webp',
      'bot-flow/tg-sticker/5310029292527164639.webp',
      'bot-flow/tg-sticker/5310228579009699834.webp',
      'bot-flow/tg-sticker/5377498341074542641.webp',
    ],
  },
};
