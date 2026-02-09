import React, { useState, useMemo, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { EDIT_ORGANIZATION } from "@/graphql/mutations";
import { Organization } from "@/lib/types/types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { countryList } from "@/helpers/helpers";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/Dropdown";

interface EditOrganizationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  organization: Organization | null;
  refetchOrganizations: () => void;
}

const EditOrganizationDialog: React.FC<EditOrganizationDialogProps> = ({
  isOpen,
  onOpenChange,
  organization,
  refetchOrganizations,
}) => {
  const [editOrganizationMutation] = useMutation(EDIT_ORGANIZATION);
  const [currentCountry, setCurrentCountry] = useState<string>("");

  const getCountryFromLocation = async () => {
    return new Promise<string | null>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
            );
            const data = await response.json();
            resolve(data.address.country);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          reject(error);
        },
      );
    });
  };

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const detectedCountry = await getCountryFromLocation();
        setCurrentCountry(detectedCountry || "New Zealand");
      } catch (error) {
        setCurrentCountry("New Zealand");
      }
    };
    fetchCountry();
  }, []);

  const [editOrganizationData, setEditOrganizationData] = useState<{
    name: string;
    address: string;
    country: string;
    organizationType: string;
  }>({
    name: organization?.name || "",
    address: organization?.address || "",
    country: organization?.country || "",
    organizationType: organization?.organizationType || "",
  });

  const mutationVariables = useMemo(
    () => ({
      data: {
        id: Number(organization?.id),
        ...editOrganizationData,
      },
    }),
    [organization, editOrganizationData],
  );

  const handleEditOrganization = async () => {
    try {
      await editOrganizationMutation({ variables: mutationVariables });
      onOpenChange(false);
      refetchOrganizations();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setEditOrganizationData({
      name: organization?.name || "",
      address: organization?.address || "",
      country: organization?.country || currentCountry,
      organizationType: organization?.organizationType || "",
    });
  }, [organization, currentCountry]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Edit Organisation</DialogTitle>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditOrganization();
            }}
          >
            <div className="mt-4">
              <label htmlFor="editName" className="text-sm font-semibold">
                Name
              </label>
              <Input
                type="text"
                id="editName"
                name="name"
                placeholder="Type.."
                className="mt-2 w-full"
                value={editOrganizationData.name}
                onChange={(event) => {
                  const { name, value } = event.target;
                  setEditOrganizationData((prev) => ({
                    ...prev,
                    [name]: value,
                  }));
                }}
              />
            </div>

            <div className="mt-4">
              <label htmlFor="editAddress" className="text-sm font-semibold">
                Address
              </label>
              <Input
                type="text"
                id="editAddress"
                name="address"
                placeholder="Type.."
                className="mt-2 w-full"
                value={editOrganizationData.address}
                onChange={(event) => {
                  const { name, value } = event.target;
                  setEditOrganizationData((prev) => ({
                    ...prev,
                    [name]: value,
                  }));
                }}
              />
            </div>

            <div className="mt-4 flex-col">
              <label htmlFor="editCountry" className="text-sm font-semibold">
                Country
              </label>
              <Select
                value={editOrganizationData.country}
                onValueChange={(value) =>
                  setEditOrganizationData((prev) => ({
                    ...prev,
                    country: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Country">
                    {editOrganizationData.country}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {countryList.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4">
              <label
                htmlFor="editOrganizationType"
                className="text-sm font-semibold"
              >
                Organisation Type
              </label>
              <Input
                type="text"
                id="editOrganizationType"
                name="organizationType"
                placeholder="Type.."
                className="mt-2 w-full"
                value={editOrganizationData.organizationType}
                onChange={(event) => {
                  const { name, value } = event.target;
                  setEditOrganizationData((prev) => ({
                    ...prev,
                    [name]: value,
                  }));
                }}
              />
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="mt-6 flex justify-between">
              <Button onClick={() => onOpenChange(false)} variant={"outline"}>
                Cancel
              </Button>
              <Button type="submit">Update Organisation</Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrganizationDialog;
