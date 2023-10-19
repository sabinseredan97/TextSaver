import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import Image from "next/image";
import { getUser } from "@/services/server-actions";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/profile");
  }

  const userData = await getUser(session.user.email);

  return (
    <section className="py-24 text-center">
      <div
        className="card"
        style={{ backgroundColor: "rgba(135, 206, 235, 0.8)" }}
      >
        <div className="text-center">
          <Image
            priority={true}
            src={userData.image}
            className="rounded-circle shadow-4-strong mt-1"
            alt={userData.name}
            width={120}
            height={120}
          />
        </div>
        <div className="card-body">
          <h5 className="card-title">{userData.name}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{userData.email}</h6>
          {/* <ul className="list-group list-group-flush">
            <li className="list-group-item">An item</li>
            <li className="list-group-item">A second item</li>
            <li className="list-group-item">A third item</li>
          </ul> */}
          {/* <a href="#" className="btn btn-primary">
            Go somewhere
          </a> */}
        </div>
      </div>
    </section>
  );
}
