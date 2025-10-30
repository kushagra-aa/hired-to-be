import { OrganizationEntity } from "@hiredtobe/shared/entities";
import { getInitials } from "@hiredtobe/shared/utils";
import { Briefcase, Globe, Linkedin, Pencil, Trash2 } from "lucide-react";

import UIButton from "@/client/components/ui/Button";
import Loader from "@/client/components/ui/Loader";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/client/shadcn/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/client/shadcn/components/ui/card";

function OrganizationCard({
  organization,
  handleDeleteClick,
  handleEditClick,
  isLoading,
}: {
  organization: OrganizationEntity;
  handleDeleteClick: (org: OrganizationEntity) => Promise<void>;
  handleEditClick: (org: OrganizationEntity) => Promise<void>;
  isLoading?: boolean;
}) {
  return (
    <Card
      key={organization.id}
      className="hover:shadow-lg transition-shadow duration-200 relative"
      data-loading={isLoading}
    >
      {isLoading && (
        <div className="absolute flex items-center justify-center h-full w-full">
          <Loader variant="clip" />
        </div>
      )}
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={organization.logoURL || undefined}
              alt={organization.name}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
              {getInitials(organization.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg wrap-break-word">
              {organization.name}
            </h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 h-full">
        {organization.website && (
          <a
            href={organization.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
          >
            <Globe className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Website</span>
          </a>
        )}

        {organization.linkedIn && (
          <a
            href={organization.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
          >
            <Linkedin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">LinkedIn</span>
          </a>
        )}

        {organization.careersURL && (
          <a
            href={organization.careersURL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
          >
            <Briefcase className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Careers</span>
          </a>
        )}

        {!organization.website &&
          !organization.linkedIn &&
          !organization.careersURL && (
            <p className="text-sm text-slate-400 italic">No links available</p>
          )}
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        <UIButton
          variant="outline"
          size="sm"
          className="flex-1"
          disabled={isLoading}
          onClick={() => handleEditClick(organization)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </UIButton>
        <UIButton
          variant="destructive"
          size="sm"
          className="flex-1"
          disabled={isLoading}
          onClick={() => handleDeleteClick(organization)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </UIButton>
      </CardFooter>
    </Card>
  );
}

export default OrganizationCard;
