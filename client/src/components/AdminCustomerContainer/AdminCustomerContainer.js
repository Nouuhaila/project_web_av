import React from "react";

import AdminContainer from "../Admin/AdminContainer";
import CustomerContainer from "../CustomerContainer/CustomerContainer";
import SellerContainer from "../SellerContainer/SellerContainer";

function AdminCustomerContainer(props) {
  return (
    <>
      {props?.isAdmin == 1 ? ( // Administrateur
        <AdminContainer {...props} />
      ) : props?.isAdmin == 2 ? ( // Vendeur
        <SellerContainer {...props} />
      ) : ( // Client
        <CustomerContainer {...props} />
      )}
    </>
  );
}

export default AdminCustomerContainer;
