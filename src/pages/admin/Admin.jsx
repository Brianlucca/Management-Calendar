import AdminPanel from "../../components/admin/adminPanel/AdminPanel";
import AdminUserForm from "../../components/admin/AdminUserForm";

function Admin() {
  return (
    <main className="flex-center justify-center items-center md:ml-16 mt-16">
      <div>
        <AdminUserForm />
      </div>
      <div>
        <AdminPanel />
      </div>
    </main>
  );
}
export default Admin;
