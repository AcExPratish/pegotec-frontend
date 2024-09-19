import axios from "axios";
import React from "react";
import BasicDialog from "../../../components/BasicDialog";

//interfaces
interface ITaskRows {
  id: undefined | number;
  title: string;
  description: string;
}

const initialFormData = {
  id: undefined,
  title: "",
  description: "",
};

const tableHeaders: string[] = ["S.N", "Title", "Description", "Actions"];

const Task = () => {
  const [formData, setFormData] = React.useState<ITaskRows>(initialFormData);
  const [rows, setRows] = React.useState<ITaskRows[]>([]);
  const [selected, setSelected] = React.useState<string>("");
  const [errors, setErrors] = React.useState<any>({});

  const handleClose = () => {
    setFormData(initialFormData);
    setSelected("");
    setErrors({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onClickActionHandler = (data: any, type: string) => {
    setFormData(data);
    setSelected(type);
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData?.title?.trim()) {
      newErrors.title = "This field is required";
    }

    if (!formData?.description?.trim()) {
      newErrors.description = "This field is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      if (selected === "delete" && formData?.id) {
        axios
          .delete(`http://localhost:8000/api/task/${formData?.id}`)
          .then((response) => {
            fetchTasks();
            handleClose();
            console.info(response?.data?.message);
          })
          .catch((error) => console.error(error));
      } else if (selected === "store" && !formData?.id) {
        axios
          .post(`http://localhost:8000/api/task`, formData)
          .then((response) => {
            fetchTasks();
            handleClose();
            console.info(response?.data?.message);
          })
          .catch((error) => console.error(error));
      }
    }
  };

  const taskForm = (
    <form className="flex flex-col gap-4 mt-4 w-96" onSubmit={handleSubmit}>
      <div className="flex flex-col items-start">
        <label
          className={`block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 ${
            !!errors?.title && "border-red-500"
          }`}
          htmlFor="title"
        >
          Title
        </label>
        <input
          className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white ${
            !!errors?.title && "border-red-500"
          }`}
          id="title"
          type="text"
          value={formData?.title}
          name="title"
          onChange={handleInputChange}
        />
        {!!errors?.title && (
          <span className="text-red-500">{errors?.title}</span>
        )}
      </div>
      <div className="flex flex-col items-start">
        <label
          className={`block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 ${
            !!errors?.description && "border-red-500"
          }`}
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white ${
            !!errors?.description && "border-red-500"
          }`}
          id="description"
          rows={4}
          name="description"
          value={formData?.description}
          onChange={handleInputChange}
        />
        {!!errors?.description && (
          <span className="text-red-500">{errors?.description}</span>
        )}
      </div>
    </form>
  );

  const fetchTasks = async () => {
    axios
      .get("http://localhost:8000/api/task")
      .then((response) => setRows(response?.data?.data))
      .catch((error) => console.error(error));
  };

  //useEffect
  React.useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <React.Fragment>
      {selected && (
        <BasicDialog
          isOpen={!!selected}
          title={selected === "delete" ? "Delete Task" : "Add Task"}
          content={
            selected === "delete"
              ? "Are you sure you want to delete this task? "
              : taskForm
          }
          onClose={handleClose}
          onConfirm={handleSubmit}
          confirmButtonText={selected === "delete" ? "Delete" : "Add"}
          cancelButtonText="Cancel"
        />
      )}

      <div className="flex flex-col items-center justify-center gap-4 container w-full mx-auto mt-10 shadow-lg">
        <div className="flex items-center justify-end w-full">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              onClickActionHandler(initialFormData, "store");
            }}
          >
            Add Task
          </button>
        </div>
        <table className="w-full">
          <tr>
            {tableHeaders?.map((data: string, key: number) => (
              <th key={key + 1}>{data}</th>
            ))}
          </tr>
          {rows?.map((data: ITaskRows, key: number) => (
            <tr key={key + 1}>
              <td>{key + 1}</td>
              <td>{data?.title}</td>
              <td>{data?.description}</td>
              <td
                className="cursor-pointer hover:text-red-500"
                onClick={() => {
                  onClickActionHandler(data, "delete");
                }}
              >
                Delete
              </td>
            </tr>
          ))}
        </table>
      </div>
    </React.Fragment>
  );
};

export default Task;
