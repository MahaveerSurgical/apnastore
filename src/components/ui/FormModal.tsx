import {Modal} from "./Modal";
import AddCustomerForm from "../forms/AddCustomerForm";
import AddWorkerForm from "../forms/AddWorkerForm";
import AddRawMaterialForm from "../forms/AddRawMaterialForm.tsx";
import AddFinishedGoodForm from "../forms/AddReadyBeltForm.tsx";
import AddProductionOrderForm from "../forms/AddProductionOrderForm.tsx";
import AddSalesOrderForm from "../forms/AddSalesOrderForm.tsx";

type Props = {
  open: boolean;
  onClose: () => void;
  page: string;
};

export default function FormModal({ open, onClose, page }: Props) {
  const renderForm = () => {
    switch (page) {
      case "customers":
        return <AddCustomerForm onClose={onClose} />;
      case "workers":
        return <AddWorkerForm onClose={onClose} />;
      case "rawMaterials":
        return <AddRawMaterialForm onClose={onClose} />;
      case "finishedGoods":
        return <AddFinishedGoodForm onClose={onClose} />;
      case "productionOrders":
        return <AddProductionOrderForm onClose={onClose} />;
      case "salesOrders":
        return <AddSalesOrderForm onClose={onClose} />;
      default:
        return <div className="p-4">No form available</div>;
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      {renderForm()}
    </Modal>
  );
}