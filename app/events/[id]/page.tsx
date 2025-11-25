import EventDetailsPage from "@/components/pages/EventDetailsPage";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EventDetails({ params }: PageProps) {
  return <EventDetailsPage eventId={params.id} />;
}
