import { useState } from 'react';

import { getMediaFileUrl } from '@/api/media';
import { uploadUserAvatar } from '@/api/users/client';
import { CompactInlineImageDropArea } from '@/components/CompactInlineImageDropArea';

export function UserAvatar({
  userId,
  hasAvatar: initialHasAvatar,
  className,
}: {
  userId: number;
  hasAvatar: boolean;
  className?: string;
}) {
  const [hasAvatar, setHasAvatar] = useState(initialHasAvatar);

  return (
    <CompactInlineImageDropArea
      className={className}
      src={hasAvatar ? getMediaFileUrl(`user/${userId}`) : undefined}
      alt="Фотографія користувача"
      onFileChanged={async (file) => {
        await uploadUserAvatar(file);
        setHasAvatar(true);
      }}
    />
  );
}
