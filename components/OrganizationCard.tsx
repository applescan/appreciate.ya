import React from "react";
import { Organization } from "@/lib/types/types";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { MdWorkOutline, MdEdit } from "react-icons/md";
import { capitalizeEachWord } from "@/helpers/helpers";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { HiOutlineGlobeEuropeAfrica } from "react-icons/hi2";
import { TbUserCog, TbUser } from "react-icons/tb";

interface OrganizationCardProps {
  organization: Organization;
  onEditClick: (organization: Organization) => void;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({
  organization,
  onEditClick,
}) => {
  return (
    <Card className="mt-2">
      <CardHeader className="pb-0">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">
            {capitalizeEachWord(organization.name)}
          </CardTitle>
          <MdEdit
            className="cursor-pointer text-[var(--color-muted)]"
            onClick={() => onEditClick(organization)}
          />
        </div>
        <CardDescription className="text-[var(--color-muted)]">
          <span className="text-xs flex gap-2 items-center">
            <HiOutlineOfficeBuilding className="text-[var(--color-muted)]" /> Address:{" "}
            {organization.address}
          </span>
          <span className="text-xs flex gap-2 items-center">
            <MdWorkOutline className="text-[var(--color-muted)]" /> Type:{" "}
            {capitalizeEachWord(organization.organizationType)}
          </span>
          <span className="text-xs flex gap-2 items-center">
            <HiOutlineGlobeEuropeAfrica className="text-[var(--color-muted)]" /> Country:{" "}
            {organization.country}
          </span>
        </CardDescription>
      </CardHeader>
      <div className="px-6 py-2">
        <h3 className="text-sm font-semibold text-[var(--color-fg)]">Admins</h3>
        <ul>
          {organization.admins.length > 0 ? (
            organization.admins.map((admin) => (
              <li key={admin.email} className="flex items-center text-xs gap-2">
                <TbUserCog className="cursor-pointer text-[var(--color-muted)]" />
                <span>
                  {capitalizeEachWord(admin.name)} - {admin.email}
                </span>
              </li>
            ))
          ) : (
            <li className="text-xs text-[var(--color-muted)]">No admin</li>
          )}
        </ul>
        <h3 className="text-sm font-semibold text-[var(--color-fg)] pt-2">Users</h3>
        <ul className="mb-4">
          {organization.users.length > 0 ? (
            organization.users.map((user) => (
              <li key={user.email} className="flex items-center text-xs gap-2">
                <TbUser className="cursor-pointer text-[var(--color-muted)]" />
                <span>
                  {capitalizeEachWord(user.name)} - {user.email}
                </span>
              </li>
            ))
          ) : (
            <li className="text-xs text-[var(--color-muted)]">No user</li>
          )}
        </ul>
      </div>
    </Card>
  );
};

export default OrganizationCard;
