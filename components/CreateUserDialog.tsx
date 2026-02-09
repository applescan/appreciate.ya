"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Organization, UserRole } from "@/lib/types/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/Button";
import { BiSolidMessageSquareAdd } from "react-icons/bi";
import { capitalizeEachWord } from "@/helpers/helpers";

interface CreateUserDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  data: { organizations: Organization[] };
  refetchUsers: () => void;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({
  isOpen,
  onOpenChange,
  data,
  refetchUsers,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<number | null>(null);
  const [createUserData, setCreateUserData] = useState<{
    name: string;
    email: string;
    password: string;
    role: string;
    orgId: number | null;
  }>({
    name: "",
    email: "",
    password: "",
    role: "",
    orgId: null,
  });
  const handleCreateUserInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;
    const newValue =
      name === "orgId" ? (value ? parseInt(value, 10) : null) : value;
    setCreateUserData({ ...createUserData, [name]: newValue });
  };

  const handleOrgSelect = (orgId: number) => {
    setSelectedOrg(orgId);
    setCreateUserData({ ...createUserData, orgId: orgId });
  };

  const handleCreateUserSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createUserData),
    });

    if (response.ok) {
      const result = await response.json();
      refetchUsers();
      onOpenChange(false);
      console.log(result);
    } else {
      console.error("Error creating user:", response.status);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger>
        <div className="rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] px-4 py-2 text-sm font-semibold text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition">
          {" "}
          <div className="flex items-center gap-2">
            <BiSolidMessageSquareAdd /> Create new user
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            <form onSubmit={handleCreateUserSubmit}>
              <div className="mt-4">
                <label htmlFor="email" className="text-sm font-semibold">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Type.."
                  className="mt-2 w-full"
                  value={createUserData.email}
                  onChange={handleCreateUserInputChange}
                  required
                />
              </div>
              <div className="mt-4">
                <label htmlFor="password" className="text-sm font-semibold">
                  Password
                </label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Type.."
                  className="mt-2 w-full"
                  value={createUserData.password}
                  onChange={handleCreateUserInputChange}
                  required
                />
              </div>
              <div className="mt-4">
                <label htmlFor="name" className="text-sm font-semibold">
                  Name
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Type.."
                  className="mt-2 w-full"
                  value={createUserData.name}
                  onChange={handleCreateUserInputChange}
                  required
                />
              </div>

              <div className="mt-4 flex flex-col">
                <label htmlFor="role" className="text-sm font-semibold">
                  Role
                </label>
                <Select
                  value={selectedRole || ""}
                  onValueChange={(role) => setSelectedRole(role as UserRole)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(UserRole).map((key) => (
                      <SelectItem
                        key={key}
                        value={UserRole[key as keyof typeof UserRole]}
                      >
                        {capitalizeEachWord(key)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4 flex flex-col">
                <label htmlFor="orgId" className="text-sm font-semibold">
                  Organization
                </label>
                <Select
                  value={selectedOrg?.toString() || ""}
                  onValueChange={(orgId) => handleOrgSelect(Number(orgId))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {data?.organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-6 flex justify-between items-center gap-2">
                <Button onClick={() => onOpenChange(false)} variant={"outline"}>
                  Cancel
                </Button>
                <Button type="submit">Create User</Button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
