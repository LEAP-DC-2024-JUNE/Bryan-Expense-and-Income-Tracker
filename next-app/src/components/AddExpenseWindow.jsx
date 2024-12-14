"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CurrencyInput from "react-currency-input-field";

const AddExpenseWindow = () => {
  const defaultData = {
    date: "",
    description: "",
    type: "",
    amount: 0.0,
  };
  const [data, setData] = useState(defaultData);

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [showError, setShowError] = useState(false);

  const router = useRouter();

  const validateForm = () => {
    let errors = {};
    if (data.date === "") {
      errors.date = "Date is required.";
    }
    if (data.description === "") {
      errors.description = "Description is required.";
    }
    if (data.type === "") {
      errors.type = "Type is required.";
    }
    if (data.amount <= 0) {
      errors.amount = "Amount is invalid.";
    }
    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleValueChange = (value, name, values) => {
    setData((prevState) => ({ ...prevState, amount: parseFloat(value) }));
  };

  const closeAddWindow = () => {
    setData(defaultData);
    setShowError(false);
    router.back();
  };

  const handleClickAdd = async () => {
    if (!isFormValid) {
      setShowError(true);
      return;
    } else {
      try {
        console.log(data);
        await fetch(`${process.env.NEXT_PUBLIC_URL}/api/expenses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        closeAddWindow();
      } catch (error) {
        console.error("Error adding expense:", error);
      }
    }
  };

  useEffect(() => {
    validateForm();
  }, [data]);

  return (
    <div className="flex-shrink-0 flex flex-col gap-8 items-center  min-w-[24rem] max-w-screen-sm bg-gray-50 py-7 px-5  rounded-xl border-2 border-gray-400">
      <h1 className=" text-center text-3xl font-bold">Add Expense</h1>
      <div className="w-full flex-shrink-0 flex flex-col gap-4 items-start">
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="date" className="text-lg font-semibold">
            Date:
          </label>
          <input
            type="date"
            name="date"
            id="date"
            value={data.date}
            onChange={handleChange}
            className="border-2 border-black  px-4 py-1  rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="description" className="text-lg font-semibold">
            Description:
          </label>
          <textarea
            maxLength={100}
            name="description"
            id="description"
            value={data.description}
            onChange={handleChange}
            className="border-2 border-black  px-4 py-1  rounded-lg"
          ></textarea>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="type" className="text-lg font-semibold">
            Type:
          </label>
          <select
            name="type"
            id="type"
            value={data.type}
            onChange={handleChange}
            className="border-2 border-black  px-4 py-1 rounded-lg"
          >
            <option value="" defaultValue={true} hidden disabled></option>
            <option value="Food">Food</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Transportation">Transportation</option>
            <option value="Accommodation">Accommodation</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="amount" className="text-lg font-semibold">
            Amount:
          </label>
          <CurrencyInput
            name="amount"
            id="amount"
            prefix="$"
            placeholder="Please enter a number"
            defaultValue={data.amount}
            decimalScale={2}
            onValueChange={handleValueChange}
            className="border-2 border-black  px-4 py-1 rounded-lg"
          />
        </div>
      </div>

      <div className="text-red-400 font-medium text-lg">
        {showError && "Missing information."}
      </div>

      <div className="w-full flex-shrink-0 flex gap-5 space-around">
        <button
          onClick={handleClickAdd}
          className="button button-blue w-1/2 hover:!bg-blue-400"
        >
          Add
        </button>
        <button
          onClick={closeAddWindow}
          className="button button-red w-1/2 hover:!bg-red-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddExpenseWindow;
