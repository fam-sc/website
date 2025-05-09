import { Meta, StoryObj } from "@storybook/react";
import { SignPage } from "./page";

const meta: Meta<typeof SignPage> = {
  title: "Pages/SignPage",
  component: SignPage,
 
};

export default meta;

type Story = StoryObj<typeof SignPage>;

export const Default: Story = {};
