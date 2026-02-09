import React from "react";
import { User } from "@/lib/types/types";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { capitalizeEachWord, getInitials } from "@/helpers/helpers";
import { MdOutlineMailOutline, MdWorkOutline, MdEdit } from "react-icons/md";
import { HiOutlineOfficeBuilding } from "react-icons/hi";

interface UserCardProps {
  user: User;
  onEditClick: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEditClick }) => {
  return (
    <Card className="mt-2 mb-4">
      <div className="flex items-center gap-4 p-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.image} />
          <AvatarFallback className="text-2xl">
            {user?.name ? getInitials(user.name) : "NA"}
          </AvatarFallback>
        </Avatar>
        <CardHeader className="min-w-0 p-0">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">
              {capitalizeEachWord(user.name)}
            </CardTitle>
            <MdEdit
              className="cursor-pointer text-[var(--color-muted)]"
              onClick={() => onEditClick(user)}
            />
          </div>
          <CardDescription className="space-y-1 text-[var(--color-muted)]">
            <span className="text-xs flex gap-2 items-center">
              <MdOutlineMailOutline className="text-[var(--color-muted)]" />
              <span className="truncate max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                {user.email}
              </span>
            </span>
            <span className="text-xs flex gap-2 items-center">
              <MdWorkOutline className="text-[var(--color-muted)]" />
              {capitalizeEachWord(user.role)}
            </span>
            <span className="text-xs flex gap-2 items-center">
              <HiOutlineOfficeBuilding className="text-[var(--color-muted)]" />@
              {capitalizeEachWord(user.organization.name)}
            </span>
          </CardDescription>
        </CardHeader>
      </div>
    </Card>
  );
};

export default UserCard;
