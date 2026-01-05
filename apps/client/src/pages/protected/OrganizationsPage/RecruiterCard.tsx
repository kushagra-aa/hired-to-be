import { RecruiterEntity } from "@hiredtobe/shared/entities";
import { getInitials } from "@hiredtobe/shared/utils";
import { Linkedin, Mail, Pencil, PhoneCallIcon, Trash2 } from "lucide-react";

import UIButton from "@/client/components/ui/Button";
import Loader from "@/client/components/ui/Loader";
import { Avatar, AvatarFallback } from "@/client/shadcn/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/client/shadcn/components/ui/card";

function RecruiterCard({
  recruiter,
  handleDeleteClick,
  handleEditClick,
  isLoading,
}: {
  recruiter: RecruiterEntity;
  handleDeleteClick: (d: RecruiterEntity) => Promise<void>;
  handleEditClick: (d: RecruiterEntity) => Promise<void>;
  isLoading?: boolean;
}) {
  return (
    <Card
      key={recruiter.id}
      className="hover:shadow-lg transition-shadow duration-200 relative py-4 gap-6"
      data-loading={isLoading}
    >
      {isLoading && (
        <div className="absolute flex items-center justify-center h-full w-full">
          <Loader variant="clip" />
        </div>
      )}
      <CardHeader className="">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
              {getInitials(recruiter.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg wrap-break-word">
              {recruiter.name}
            </h3>
          </div>
        </div>
        {/* </Link> */}
      </CardHeader>

      <CardContent className="h-full flex gap-4 items-center">
        {recruiter.email && (
          <a
            href={`mailto:${recruiter.email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
          >
            <Mail className="h-6 w-6 flex-shrink-0" />
          </a>
        )}

        {recruiter.linkedIn && (
          <a
            href={`${recruiter.linkedIn}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
          >
            <Linkedin className="h-6 w-6 flex-shrink-0" />
          </a>
        )}
        {recruiter.phone && (
          <span className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors ml-auto">
            <a
              href={`tel:${recruiter.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <PhoneCallIcon className="h-6 w-6 flex-shrink-0" />
            </a>
            {recruiter.phone}
          </span>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <UIButton
          variant="outline"
          size="sm"
          className="flex-1"
          disabled={isLoading}
          onClick={() => handleEditClick(recruiter)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </UIButton>
        <UIButton
          variant="destructive"
          size="sm"
          className="flex-1"
          disabled={isLoading}
          onClick={() => handleDeleteClick(recruiter)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </UIButton>
      </CardFooter>
    </Card>
  );
}

export default RecruiterCard;
