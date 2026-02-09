"use-client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BiSolidMessageSquareAdd } from "react-icons/bi";
import { useMutation } from "@apollo/client";
import { CREATE_ORGANIZATION } from "@/graphql/mutations";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "./ui/Dropdown";
import { countryList } from "@/helpers/helpers";

interface CreateOrganizationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  refetchOrganizations: () => void;
}

const CreateOrganizationDialog: React.FC<CreateOrganizationDialogProps> = ({
  isOpen,
  onOpenChange,
  refetchOrganizations,
}) => {
  const [createOrganization] = useMutation(CREATE_ORGANIZATION);
  const [currentCountry, setCurrentCountry] = useState<string>("");

  const fields = [
    { label: "Name", id: "name" as keyof typeof orgDataInitialState },
    { label: "Address", id: "address" as keyof typeof orgDataInitialState },
    { label: "Country", id: "country" as keyof typeof orgDataInitialState },
    {
      label: "Organization Type",
      id: "organizationType" as keyof typeof orgDataInitialState,
    },
  ];

  const orgDataInitialState = {
    name: "",
    address: "",
    country: currentCountry,
    organizationType: "",
  };

  const [orgData, setOrgData] =
    useState<typeof orgDataInitialState>(orgDataInitialState);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Set the current country if the user hasn't selected any
    if (!orgData.country) {
      orgData.country = currentCountry;
    }

    await createOrganization({ variables: orgData });
    refetchOrganizations();
    onOpenChange(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrgData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountrySelect = (country: string) => {
    setCurrentCountry(country);
    setOrgData((prev) => ({ ...prev, country }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger>
        <div className="rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] px-4 py-2 text-sm font-semibold text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition">
          <div className="flex items-center gap-2">
            <BiSolidMessageSquareAdd /> Create new organisation
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Organisation</DialogTitle>
          <DialogDescription>
            <form onSubmit={handleSubmit}>
              {fields.map((field) => (
                <div key={field.id} className="mt-4">
                  <label htmlFor={field.id} className="text-sm font-semibold">
                    {field.label}
                  </label>
                  {field.id !== "country" ? (
                    <Input
                      type="text"
                      id={field.id}
                      name={field.id}
                      placeholder="Type.."
                      className="mt-2 w-full"
                      value={orgData[field.id]}
                      onChange={handleChange}
                      required
                    />
                  ) : (
                    <div className="flex flex-col mt-2">
                      <Select
                        value={currentCountry}
                        onValueChange={handleCountrySelect}
                      >
                        <SelectTrigger aria-label="Country">
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {countryList.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ))}

              <div className="mt-6 flex justify-between items-center gap-2">
                <Button onClick={() => onOpenChange(false)} variant={"outline"}>
                  Cancel
                </Button>
                <Button type="submit">Create Organisation</Button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrganizationDialog;
