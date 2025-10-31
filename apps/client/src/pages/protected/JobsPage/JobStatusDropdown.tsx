import { JobEntity, JobStatusEnum } from "@hiredtobe/shared/entities";

import UIButton from "@/client/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/client/shadcn/components/ui/dropdown-menu";

export const JOB_STATUSES = Object.values(JobStatusEnum);

function JobStatusDropdown({
  job,
  updateStatus,
  color,
}: {
  job: JobEntity;
  updateStatus: (id: number, status: JobStatusEnum) => void;
  color: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UIButton
          variant={"outline"}
          className="rounded-3xl text-xs"
          style={{ borderColor: color, color }}
        >
          <span className="undeline underline-offset-4">{job.status}</span>
        </UIButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {JOB_STATUSES.map((s) => (
          <DropdownMenuItem
            key={s}
            onClick={() => updateStatus(job.id, s)}
            className={s === job.status ? "font-bold" : ""}
          >
            {s}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default JobStatusDropdown;
