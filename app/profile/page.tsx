"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { EDIT_USER } from "@/graphql/mutations";
import { GET_USER_BY_ID } from "@/graphql/queries";
import { Input } from "@/components/ui/Input";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { capitalizeEachWord, getInitials } from "@/helpers/helpers";
import { VERIFY_CURRENT_PASSWORD } from "@/graphql/mutations";
import ErrorPage from "@/components/ui/Error";
import { Status } from "@/lib/types/types";

export default function Page() {
  const { data: sessionData, status } = useSession();
  const user = sessionData?.user;
  const [editUser] = useMutation(EDIT_USER);
  const [imageUrl, setImageUrl] = useState(user?.image || "");
  const [imageSrc, setImageSrc] = useState<string | undefined>();
  const [uploadData, setUploadData] = useState();
  const [editUserMutation] = useMutation(EDIT_USER);
  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    variables: { id: user?.id },
    skip: !user,
  });
  const currentUser = data?.user;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [verifyCurrentPasswordMutation] = useMutation(VERIFY_CURRENT_PASSWORD);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editUserData, setEditUserData] = useState<{
    name: string;
    email: string;
    password?: string;
    role: string;
    orgId: number;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
    orgId: Number(data?.user?.organization.id),
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const mutationVariables = useMemo(
    () => ({
      id: Number(user?.id),
      name: editUserData.name,
      email: editUserData.email,
      role: editUserData.role,
      orgId: editUserData.orgId,
      password: editUserData.newPassword ? editUserData.newPassword : undefined,
    }),
    [user, editUserData]
  );

  const isPasswordValid = useMemo(() => {
    if (editUserData.currentPassword) {
      return editUserData.newPassword && editUserData.confirmPassword;
    }
    return true;
  }, [
    editUserData.currentPassword,
    editUserData.newPassword,
    editUserData.confirmPassword,
  ]);

  const handleEditUser = async () => {
    setErrorMessage(null);

    if (!isPasswordValid) {
      setErrorMessage(
        "New password fields can't be empty when current password is provided."
      );
      return;
    }

    // Check if the passwords match.
    if (editUserData.newPassword !== editUserData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    // If a new password is being set, verify the current password.
    if (editUserData.newPassword && editUserData.currentPassword) {
      try {
        // Verify current password.
        await verifyCurrentPasswordMutation({
          variables: {
            userId: user?.id,
            password: editUserData.currentPassword,
          },
        });

        // If verification is successful, proceed to update user details.
        await editUserMutation({ variables: mutationVariables });

        // Reload the page after successful update.
        window.location.reload();
      } catch (error: any) {
        setErrorMessage(error.message || "An error occurred");
      }
    } else if (!editUserData.newPassword) {
      // If no new password is being set, simply update user details without verifying.
      try {
        await editUserMutation({ variables: mutationVariables });

        // Reload the page after successful update.
        window.location.reload();
      } catch (error: any) {
        setErrorMessage(error.message || "An error occurred");
      }
    } else {
      setErrorMessage("Please provide your current password to set a new one.");
    }
  };

  useEffect(() => {
    if (currentUser) {
      setEditUserData({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        role: currentUser?.role || "",
        orgId: Number(data?.user?.organization.id),
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [currentUser]);

  const handleOnChange = (changeEvent: React.FormEvent<HTMLFormElement>) => {
    const form = changeEvent.currentTarget;
    const fileInput =
      form.querySelector<HTMLInputElement>("input[type='file']");
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const reader = new FileReader();

      reader.onload = function (onLoadEvent: ProgressEvent<FileReader>) {
        if (onLoadEvent.target && onLoadEvent.target.result) {
          setImageSrc(onLoadEvent.target.result as string);
        }
      };

      reader.readAsDataURL(fileInput.files[0]);
      handleOnSubmit(changeEvent);
    }
  };

  const handleOnSubmit = async (event: {
    preventDefault: () => void;
    currentTarget: any;
  }) => {
    event.preventDefault();

    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(
      (element: any) => element.name === "file"
    ) as HTMLInputElement;
    const formData = new FormData();

    if (fileInput.files) {
      const filesArray = Array.from(fileInput.files);
      for (const file of filesArray) {
        formData.append("file", file);
      }
    }

    formData.append("upload_preset", "profile");

    const data = await fetch(
      `${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`,
      {
        method: "POST",
        body: formData,
      }
    ).then((r) => r.json());

    // After uploading to Cloudinary, update the user's image in the database.
    editUser({
      variables: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        orgId: user.orgId,
        image: data.secure_url,
      },
    })
      .then((response) => {
        setImageUrl(response.data.editUser.image);
      })
      .catch((error) => {
        setErrorMessage("Error updating user with new image: " + error.message);
      });

    setImageSrc(data.secure_url);
    setUploadData(data);
  };

  if (status === Status.LOADING) return <Loading></Loading>;

  const handleDeletePicture = () => {
    editUser({
      variables: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        orgId: user.orgId,
        image: null,
      },
    })
      .then((response) => {
        setImageUrl(null);
      })
      .catch((error) => {
        setErrorMessage("Error deleting user image: " + error.message);
      });
  };

  if (loading) return <Loading></Loading>;
  if (error) return <ErrorPage />;

  return (
    <div>
      <main className="flex flex-col gap-8 mb-10">
        <div className="surface-card rounded-3xl p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:justify-between">
            {/* User avatar and info */}
            <div className="flex items-center gap-2 md:gap-10">
              <Avatar className="h-28 w-28 md:w-36 md:h-36">
                <AvatarImage src={currentUser.image} />
                <AvatarFallback className="text-3xl">
                  {currentUser?.name ? getInitials(currentUser.name) : "NA"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-2xl font-semibold text-[var(--color-fg)]">
                  {capitalizeEachWord(currentUser.name)}
                </p>
                <p className="text-sm text-[var(--color-muted)]">{`${capitalizeEachWord(
                  currentUser.role
                )} @${currentUser.organization.name}`}</p>
              </div>
            </div>
            {/* Picture upload and removal */}
            <div className="flex gap-4 items-center">
              <form
                method="post"
                onChange={handleOnChange}
                onSubmit={handleOnSubmit}
              >
                <input
                  type="file"
                  name="file"
                  className="hidden"
                  ref={fileInputRef}
                />
                <div className="flex gap-4 justify-between">
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload new picture
                  </Button>
                  <Button onClick={handleDeletePicture} variant="outline">
                    Remove
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Profile Details Form */}
        <div className="surface-card rounded-3xl px-8 py-6">
          <div className="py-4">
            <p className="text-lg font-semibold text-[var(--color-fg)]">
              Personal Information
            </p>
            <p className="text-sm text-[var(--color-muted)]">
              Update your personal information
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditUser();
            }}
          >
            <div className="mt-4 flex flex-col gap-4 mb-6 w-full md:flex-row">
              <div className="flex-1">
                <label htmlFor="editName" className="text-sm font-semibold">
                  Name
                </label>
                <Input
                  type="text"
                  id="editName"
                  name="name"
                  placeholder="Type.."
                  className="mt-2 w-full"
                  value={editUserData.name}
                  onChange={(event) => {
                    const { name, value } = event.target;
                    setEditUserData((prev) => ({ ...prev, [name]: value }));
                  }}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="editEmail" className="text-sm font-semibold">
                  Email
                </label>
                <Input
                  type="email"
                  id="editEmail"
                  name="email"
                  placeholder="Type.."
                  className="mt-2 w-full"
                  value={editUserData.email}
                  onChange={(event) => {
                    const { name, value } = event.target;
                    setEditUserData((prev) => ({ ...prev, [name]: value }));
                  }}
                />
              </div>
            </div>

            <div className="py-4">
              <p className="text-lg font-semibold text-[var(--color-fg)]">
                Change Password
              </p>
              <p className="text-sm text-[var(--color-muted)]">
                Your new password must be different from your previous password
              </p>
            </div>

            {/* Current Password field */}
            <div className="mt-1  mr-4">
              <label
                htmlFor="currentPassword"
                className="text-sm font-semibold"
              >
                Current Password
              </label>
              <Input
                type="password"
                id="currentPassword"
                name="currentPassword"
                placeholder="Enter current password"
                className="mt-2 w-full md:w-1/2"
                value={editUserData.currentPassword}
                onChange={(event) => {
                  const { name, value } = event.target;
                  setEditUserData((prev) => ({ ...prev, [name]: value }));
                }}
              />
            </div>

            <div className="mt-4 flex flex-col gap-4 w-full items-center md:flex-row">
              <div className="flex-1">
                <label htmlFor="newPassword" className="text-sm font-semibold">
                  New Password
                </label>
                <Input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="Enter your new password"
                  className="mt-2 w-full"
                  value={editUserData.newPassword}
                  onChange={(event) => {
                    const { name, value } = event.target;
                    setEditUserData((prev) => ({ ...prev, [name]: value }));
                  }}
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold"
                >
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your new password"
                  className="mt-2 w-full"
                  value={editUserData.confirmPassword}
                  onChange={(event) => {
                    const { name, value } = event.target;
                    setEditUserData((prev) => ({ ...prev, [name]: value }));
                  }}
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-red-500 mt-4 text-sm">• {errorMessage}</p>
            )}

            {/* Submit and Cancel Buttons */}
            <div className="mt-6 flex justify-between">
              <div className="flex items-center gap-2">
                <Button type="submit">Update Changes</Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
