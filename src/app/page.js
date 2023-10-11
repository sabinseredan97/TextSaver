import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/");
  }

  return (
    <>
      <div className="row">
        <div className="col-sm-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Add Book</h5>
              <p className="card-text">
                Here you can add a new book, each book can have many notes that
                you can add any time, all books that you add will be saved to
                your profile.
              </p>
              <Link href="/create" className="btn btn-secondary">
                Add a new book
              </Link>
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">My Books</h5>
              <p className="card-text">
                Here you can see a list of your books, click on a book and you
                can delete it or add more notes to it.
              </p>
              <Link href="/myBooks" className="btn btn-info">
                See your books
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
