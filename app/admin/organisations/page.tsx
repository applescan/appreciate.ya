"use client";
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Organization } from "@/lib/types/types";
import { GET_ORGANIZATIONS } from "@/graphql/queries";
import Loading from "@/components/ui/Loading";
import CreateOrganizationDialog from "@/components/CreateOrgDialog";
import OrganizationCard from "@/components/OrganizationCard";
import EditOrganizationDialog from "@/components/EditOrgDialog";
import ErrorPage from "@/components/ui/Error";

type OrganizationsData = {
  organizations: Organization[];
};

const AdminOrgsPage: React.FC = () => {
  const { loading, error, data, refetch } =
    useQuery<OrganizationsData>(GET_ORGANIZATIONS);
  const [editingOrganization, setEditingOrganization] =
    useState<Organization | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [editOrganizationData, setEditOrganizationData] = useState<{
    name: string;
    address: string;
    country: string;
    organizationType: string;
  }>({
    name: "",
    address: "",
    country: "",
    organizationType: "",
  });

  if (loading) return <Loading />;
  if (error) return <ErrorPage />;

  return (
    <div className="w-full">
      <div className="flex justify-center md:justify-end gap-2 pb-6">
        <CreateOrganizationDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          refetchOrganizations={refetch}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data?.organizations.map((organization) => (
          <OrganizationCard
            key={organization.id}
            organization={organization}
            onEditClick={(organization) => {
              setEditingOrganization(organization);
              setEditOrganizationData({
                name: organization.name,
                address: organization.address,
                country: organization.country,
                organizationType: organization.organizationType,
              });
              setIsEditDialogOpen(true);
            }}
          />
        ))}
        <EditOrganizationDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          organization={editingOrganization}
          refetchOrganizations={refetch}
        />
      </div>
    </div>
  );
};

export default AdminOrgsPage;
