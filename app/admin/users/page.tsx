"use client";
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Organization, User } from "@/lib/types/types";
import { GET_USERS_AND_ORGANIZATIONS } from "@/graphql/queries";
import CreateUserDialog from "@/components/CreateUserDialog";
import Loading from "@/components/ui/Loading";
import EditUserDialog from "@/components/EditUserDialog";
import UserCard from "@/components/UserCard";
import ErrorPage from "@/components/ui/Error";

type UsersAndOrganizationsData = {
  users: User[];
  organizations: Organization[];
};

const AdminPage: React.FC = () => {
  const { loading, error, data, refetch } = useQuery<UsersAndOrganizationsData>(
    GET_USERS_AND_ORGANIZATIONS,
  );
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editUserData, setEditUserData] = useState<{
    name: string;
    email: string;
    password?: string;
    role: string;
    orgId: number | null;
  }>({
    name: "",
    email: "",
    role: "",
    orgId: null,
  });

  if (loading) return <Loading></Loading>;
  if (error) return <ErrorPage />;

  return (
    <div className="w-full">
      <div className="flex justify-center md:justify-end gap-2 pb-6">
        <CreateUserDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          data={data || { organizations: [] }}
          refetchUsers={refetch}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data?.users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEditClick={(user) => {
              setEditingUser(user);
              setEditUserData({
                name: user.name,
                email: user.email,
                role: user.role,
                orgId: Number(user.organization.id),
              });
              setIsEditDialogOpen(true);
            }}
          />
        ))}
        <EditUserDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          user={editingUser}
          organizations={data?.organizations || []}
          refetchUsers={refetch}
        />
      </div>
    </div>
  );
};

export default AdminPage;
