import { JobStatusEnum } from "@hiredtobe/shared/entities";

export const getJobCardBorder = (status: JobStatusEnum) => {
  let color = "border";
  switch (status) {
    case JobStatusEnum.rejected:
      color = "pro-color-danger";
      break;
    case JobStatusEnum.withdrawn:
      color = "pro-color-warning";
      break;
    case JobStatusEnum.accepted:
    case JobStatusEnum.offer:
      color = "pro-color-success";
      break;
    case JobStatusEnum.interview:
    case JobStatusEnum.screening:
      color = "pro-color-primary";
      break;
    default:
      color = "pro-color-border";
      break;
  }
  return `var(--${color})`;
};
