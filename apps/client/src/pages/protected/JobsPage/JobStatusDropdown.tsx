import { JobEntity, JobStatusEnum } from "@hiredtobe/shared/entities";

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
}: {
  job: JobEntity;
  updateStatus: (id: number, status: JobStatusEnum) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-purple-400 hover:underline font-semibold">
          Status: {job.status}
        </button>
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
