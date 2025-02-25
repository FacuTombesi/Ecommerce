import { CircleAlert } from "lucide-react";
import { Card, CardContent } from "./ui/card"

export function DisclaimerCard({ content }: { content: string }) {
  return (
    <Card className="mx-6 bg-gray-50">
      <CardContent className="my-0 text-muted-foreground text-sm">
        <div className="flex items-center pr-4">
          <CircleAlert width="120px" />
          <p className="ml-2">{content}</p>
        </div>
      </CardContent>
    </Card>
  );
}