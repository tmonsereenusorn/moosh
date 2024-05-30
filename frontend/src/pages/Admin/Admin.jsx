import React from "react";
import { firebaseAuth } from "../../api/firebase";
import Numbers from "../../components/Admin/Numbers";

const AdminDashboard = () => {
  return (
    firebaseAuth.currentUser?.uid === process.env.REACT_APP_ADMIN_ID && (
      <div className="flex mt-12 flex-col h-screen items-center p-4">
        <Numbers></Numbers>
      </div>
    )
  );
};

export default AdminDashboard;
