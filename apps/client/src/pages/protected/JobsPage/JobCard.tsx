import { JobFullEntity, JobStatusEnum } from "@hiredtobe/shared/entities";
import { Briefcase, Pencil, Trash2 } from "lucide-react";

import UIButton from "@/client/components/ui/Button";
import Loader from "@/client/components/ui/Loader";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/client/shadcn/components/ui/card";

const getJobCardBorder = (status: JobStatusEnum) => {
  let color = "border";
  switch (status) {
    case JobStatusEnum.rejected:
      color = "color-danger";
      break;
    case JobStatusEnum.withdrawn:
      color = "color-warning";
      break;
    case JobStatusEnum.accepted:
    case JobStatusEnum.offer:
      color = "color-success";
      break;
    case JobStatusEnum.applied:
    case JobStatusEnum.interview:
    case JobStatusEnum.screening:
      color = "color-accent";
      break;
    default:
      color = "color-border";
      break;
  }
  return `var(--${color})`;
};

function JobCard({
  job,
  handleDeleteClick,
  handleEditClick,
  isLoading,
}: {
  job: JobFullEntity;
  handleDeleteClick: (org: JobFullEntity) => Promise<void>;
  handleEditClick: (org: JobFullEntity) => Promise<void>;
  isLoading?: boolean;
}) {
  return (
    <Card
      key={job.id}
      className="hover:shadow-lg transition-shadow duration-200 relative"
      style={{ borderColor: getJobCardBorder(job.status) }}
      data-loading={isLoading}
    >
      {isLoading && (
        <div className="absolute flex items-center justify-center h-full w-full">
          <Loader variant="clip" />
        </div>
      )}
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-3xl wrap-break-word">
              {job.title}
            </h3>
            <p className="font-extralight text-xl wrap-break-word">
              {job.organization?.name}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 h-full">
        <p className="text-sm text-slate-400 italic">
          <span className="font-semibold">Location: </span>
          {job.location}
        </p>
        <a
          href={job.jdLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
        >
          <Briefcase className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">Job Detials</span>
        </a>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        <UIButton
          variant="outline"
          size="sm"
          className="flex-1"
          disabled={isLoading}
          onClick={() => handleEditClick(job)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </UIButton>
        <UIButton
          variant="destructive"
          size="sm"
          className="flex-1"
          disabled={isLoading}
          onClick={() => handleDeleteClick(job)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </UIButton>
      </CardFooter>
    </Card>
  );
}

export default JobCard;
