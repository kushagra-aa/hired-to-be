import { JobEntity, JobFullEntity } from "@hiredtobe/shared/entities";
import { Briefcase, EyeIcon, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router";

import UIButton from "@/client/components/ui/Button";
import Loader from "@/client/components/ui/Loader";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/client/shadcn/components/ui/card";
import { getJobCardBorder } from "@/client/utils/style.utils";

import JobStatusDropdown from "./JobStatusDropdown";

function JobCard({
  job,
  handleDeleteClick,
  handleEditClick,
  handleStatusChange,
  isLoading,
}: {
  job: JobFullEntity;
  handleDeleteClick: (org: JobFullEntity) => Promise<void>;
  handleEditClick: (org: JobFullEntity) => Promise<void>;
  handleStatusChange: (
    org: JobEntity["id"],
    status: JobEntity["status"],
  ) => void;
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
      <CardHeader className="">
        <div className="flex items-center gap-4 overflow-x-hidden">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-3xl truncate">{job.title}</h3>
            <p className="font-extralight text-xl wrap-break-word">
              {job.organization?.name}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 h-full">
        <p className="text-sm text-slate-400">
          <span className="font-semibold">Location: </span>
          {job.location}
        </p>
        <div>
          <span className="text-slate-400 font-semibold">Status:</span>{" "}
          <JobStatusDropdown
            job={job}
            updateStatus={handleStatusChange}
            color={getJobCardBorder(job.status)}
          />
        </div>
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
        <Link to={`/jobs/${job.id}`} className="flex-1">
          <UIButton
            variant="outline"
            size="sm"
            className="w-full"
            title="See all the detials saved for this job"
            disabled={isLoading}
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            View
          </UIButton>
        </Link>
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
