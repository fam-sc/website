'use client';

import { uploadUserAvatar } from '@/api/user/client';
import { CompactInlineImageDropArea } from '@/components/CompactInlineImageDropArea';
import { getMediaFileUrl } from '@shared/media';
import { useState } from 'react';

export function UserAvatar({
  userId,
  hasAvatar: initialHasAvatar,
  className,
}: {
  userId: string;
  hasAvatar: boolean;
  className?: string;
}) {
  const [hasAvatar, setHasAvatar] = useState(initialHasAvatar);

  return (
    <div className={className}>
      <CompactInlineImageDropArea
        src={hasAvatar ? getMediaFileUrl(`user/${userId}`) : undefined}
        alt="Фотографія користувача"
        onFileChanged={async (file) => {
          await uploadUserAvatar(file);
          setHasAvatar(true);
        }}
      />
    </div>
  );
}
