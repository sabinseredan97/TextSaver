"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

export default function Page() {
  const [data, setData] = useState({
    title: "",
    note: "",
  });

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/createIndependentNote");
    },
  });

  if (!session) {
    //redirect("/login?callbackUrl=/create");
    return <div className="text-center">Unauthorised</div>;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (data.title === "" || data.note === "")
        throw new Error("Fill the empty fields");

      const response = await fetch(`/api/addIndependentNote`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      setData({
        title: "",
        note: "",
      });
      if (response.status === 201) toast.success("Created!");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div className="form-group row mb-1">
        <label htmlFor="title" className="col-sm-2 col-form-label">
          Title
        </label>
        <div className="col-sm-10">
          <input
            onChange={(e) => setData({ ...data, title: e.target.value })}
            name="title"
            type="text"
            className="form-control"
            id="title"
            placeholder="Title"
            value={data.title}
          />
        </div>
      </div>

      <div className="form-group row mb-1">
        <label htmlFor="note" className="col-sm-2 col-form-label">
          Note
        </label>
        <div className="col-sm-10">
          <textarea
            onChange={(e) => setData({ ...data, note: e.target.value })}
            name="note"
            className="form-control"
            id="note"
            rows={17}
            placeholder="Note"
            value={data.note}
          />
        </div>
      </div>
      <div className="text-center mt-2">
        <button type="submit" className="btn btn-secondary">
          Submit
        </button>
      </div>
    </form>
  );
}
