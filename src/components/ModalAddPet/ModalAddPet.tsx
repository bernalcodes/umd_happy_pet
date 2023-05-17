import React, { ChangeEvent, useState } from "react";
import { Input } from "@material-tailwind/react";
import { v4 as uuid } from "uuid";
import { useCustomers } from "@/context/CustomersContext";
import users from "../../data/users.json" assert { type: "JSON" };
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const initialPet: Pet = {
  age: "",
  id: "",
  breed: "",
  img: "",
  name: "",
};

export default function ModalAddPet(): JSX.Element {
  const [newPet, setNewPet] = useState<Pet>(initialPet);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [search, setSearch] = useState("");

  const { customers } = useCustomers();

  const handleClickCustomer = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleSearchCustomer = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPet({ ...newPet, [name]: value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const reader: FileReader = new FileReader();
    if (e.target && e.target.files && e.target.files.length > 0) {
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (e: ProgressEvent<FileReader>) => {
        e.preventDefault();
        // @ts-ignore
        setNewPet({ ...newPet, img: e.target.result });
      };
    }
  };

  const filteredCustomers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  const handleAddPet = (newPet: Pet, idPet: string) => {};

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <>
      <div className="flex w-full flex-col gap-3">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900 sm:pr-12">
          Add new pet
        </h2>
        <div className="flex items-center gap-2">
          <div className="PETFORM flex w-full flex-col gap-4">
            <div className="flex gap-3">
              <label
                htmlFor="imagepet"
                style={{ backgroundImage: `url(${newPet.img})` }}
                className={`flex w-32 cursor-pointer items-center justify-center rounded-xl ${
                  newPet.img === ""
                    ? "border-2 border-dashed border-blue-gray-300"
                    : ""
                } bg-cover bg-center`}
              >
                {newPet.img === "" && "Add image"}
              </label>
              <input
                onChange={handleImageChange}
                type="file"
                accept="image/*"
                id="imagepet"
                className="flex hidden w-32 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-blue-gray-300"
              />
              <div className="flex w-full flex-col gap-3">
                <div className="flex gap-3">
                  <Input
                    label="Pet name"
                    name="name"
                    value={newPet.name}
                    onChange={handleChange}
                  />
                  <Input
                    label="Age"
                    name="age"
                    value={newPet.age}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex gap-3">
                  <Input label="Breed" name="breed" onChange={handleChange} />
                  <button
                    onClick={() => {
                      handleAddPet(newPet, uuid());
                    }}
                    disabled={
                      newPet.name === "" ||
                      newPet.age === "" ||
                      newPet.breed === ""
                    }
                    className="whitespace-nowrap rounded-lg bg-happy-color-primary px-6 py-2 normal-case text-white transition-colors hover:bg-happy-color-primary-light"
                  >
                    Add pet
                  </button>
                  <button
                    onClick={() => setNewPet(initialPet)}
                    className="whitespace-nowrap rounded-lg bg-happy-color-primary px-6 py-2 normal-case text-white transition-colors hover:bg-happy-color-primary-light"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`info customer selected min-w-[200px] rounded-xl border-2 ${
              selectedCustomer ? "border-solid" : "border-dashed"
            } border-happy-color-primary p-3`}
          >
            <AnimatePresence>
              {selectedCustomer ? (
                <motion.div
                  key={selectedCustomer}
                  className="flex flex-col gap-2"
                  variants={container}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <div className="flex items-end gap-2">
                    <motion.div variants={item}>
                      <Image
                        src={selectedCustomer?.image}
                        className="h-11 w-11 rounded-xl shadow-md"
                        height={200}
                        width={200}
                        alt="any"
                      />
                    </motion.div>
                    <motion.h3 variants={item} className="text-2xl font-medium">
                      {selectedCustomer?.firstName}
                    </motion.h3>
                  </div>
                  <motion.p variants={item} className="mt-2 text-sm">
                    {selectedCustomer?.email}
                  </motion.p>
                </motion.div>
              ) : (
                <>
                  <br />
                  <p className="text-center text-blue-gray-400">
                    No customer selected
                  </p>
                  <br />
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 px-3">
          <h3 className=" whitespace-nowrap font-medium">Assign new owner</h3>
          <input
            type="text"
            className="w-full rounded-xl border-2 border-solid border-gray-300 p-2 outline-none"
            placeholder="Search customer..."
            value={search}
            onChange={handleSearchCustomer}
          />
        </div>
        <div className="customers mt-4 max-h-[300px] w-full overflow-y-auto">
          <div className="flex flex-col gap-2">
            {filteredCustomers.map((customer, index) => (
              <div
                key={index}
                onClick={() => handleClickCustomer(customer)}
                className="rounded-xl p-3 hover:bg-happy-light-blue"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={customer.image}
                    className="h-11 w-11 rounded-xl shadow-md"
                    height={200}
                    width={200}
                    alt="any"
                  />
                  <div className="flex flex-col">
                    <h2>{customer.firstName}</h2>
                    <div className="text-sm text-blue-gray-400">
                      {customer.email}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
