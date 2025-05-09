import { PageProps } from "@/types/next";
import { ClientComponent } from "./client";
import { Repository } from "@data/repo";
import { notFound } from "next/navigation";
import { formatDateTime } from "@/utils/date";

export default async function Page({ params }: PageProps<{ id: string }>) {
  const { id } = await params;

  await using repo = await Repository.openConnection();
  const poll = await repo.polls().findShortPoll(id);
  if (poll === null) {
    notFound();
  }

  return (
    <ClientComponent 
      poll={{ 
        id, 
        title: poll.title,
        startDate: formatDateTime(poll.startDate),
        endDate: poll.endDate ? formatDateTime(poll.endDate) : null,
      }}
    />
  );
} 