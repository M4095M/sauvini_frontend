import { ChevronLeft, CircleQuestionMark } from "lucide-react";
import QACard from "./QACard";

export default function ListOfQuestionContainer() {
  return (
    <div className="flex flex-col overflow-y-auto gap-2">
      <QACard
        title={"Question Title"}
        description={
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Lorem ipsum"
        }
        icon_type="icon"
        icon={<CircleQuestionMark width={15} height={15} />}
        attachment={undefined}
      />
      <QACard
        title={"Question Title"}
        description={
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Lorem ipsum"
        }
        icon_type="icon"
        icon={<CircleQuestionMark width={15} height={15} />}
        attachment={undefined}
      />
      {/* <QACard
        title={"Question Title"}
        description={
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Lorem ipsum"
        }
        icon_type="button"
        icon={<ChevronLeft width={20} height={20} />}
        attachment={"url here"}
      /> */}
    </div>
  );
}
