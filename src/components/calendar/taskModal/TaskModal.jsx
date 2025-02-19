import React, { useState, useEffect } from "react";
import moment from "moment";
import { ref, remove, update, get } from "firebase/database";
import { db } from "../../../service/FirebaseConfig";
import { useAuth } from "../../../context/AuthContext";

const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  tags,
  users,
  selectedDate,
  selectedTask,
  isEditMode,
  userRole,
  currentUser,
  setIsEditMode,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    assignedTo: [],
    status: "pendente",
    completionNotes: "",
    tags: [],
    paymentDescription: "",
    paymentAmount: "",
    paymentDate: "",
    paymentTime: "",
    paymentStatus: "pendente",
  });

  const [currentTechnician, setCurrentTechnician] = useState("");
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [userTags, setUserTags] = useState([]);  // Para armazenar as tags do usuário
  const { currentUser: authUser } = useAuth();

  // No useEffect do TaskModal que carrega as tags:
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsRef = ref(db, "tags");
        const snapshot = await get(tagsRef);
        const data = snapshot.val();

        // Converter objeto em array de tags com ID
        const tagsArray = Object.entries(data || {}).map(([id, tag]) => ({
          id, // ID gerado pelo Firebase
          ...tag
        }));

        // Filtrar tags do usuário atual
        const userTagsList = tagsArray.filter(tag => tag.createdByUid === authUser.uid);

        console.log("Tags carregadas com IDs:", userTagsList);
        setUserTags(userTagsList);
      } catch (error) {
        console.error("Erro ao carregar tags:", error);
      }
    };

    if (authUser) {
      fetchTags();
    }
  }, [authUser]);

  useEffect(() => {
    if (selectedTask) {
      setFormData({
        ...selectedTask,
        startDate: moment(selectedTask.startDate).format("YYYY-MM-DD"),
        startTime: moment(selectedTask.startDate).format("HH:mm"),
        endDate: moment(selectedTask.endDate).format("YYYY-MM-DD"),
        endTime: moment(selectedTask.endDate).format("HH:mm"),
        assignedTo: selectedTask.assignedTo || [],
        tags: selectedTask.tags || [], paymentDescription: selectedTask.payment?.description || "",
        paymentAmount: selectedTask.payment?.amount || "",
        paymentDate: selectedTask.payment?.date
          ? moment(selectedTask.payment.date).format("YYYY-MM-DD")
          : "",
        paymentTime: selectedTask.payment?.date
          ? moment(selectedTask.payment.date).format("HH:mm")
          : "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        startDate: selectedDate || moment().format("YYYY-MM-DD"),
        startTime: moment().format("HH:mm"),
        endDate: selectedDate || moment().add(1, "day").format("YYYY-MM-DD"),
        endTime: moment().format("HH:mm"),
        assignedTo: [],
        status: "pendente",
        completionNotes: "",
        tags: [],
      });
    }
  }, [selectedTask, selectedDate]);

  const handleAddTechnician = () => {
    if (
      currentTechnician.trim() &&
      !formData.assignedTo.includes(currentTechnician)
    ) {
      setFormData((prev) => ({
        ...prev,
        assignedTo: [...prev.assignedTo, currentTechnician],
      }));
      setCurrentTechnician("");
    }
  };

  const handleRemoveTechnician = (name) => {
    setFormData((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.filter((e) => e !== name),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const startDate = `${formData.startDate}T${formData.startTime}:00`;
    const endDate = `${formData.endDate}T${formData.endTime}:00`;

    if (!moment(startDate).isValid() || !moment(endDate).isValid()) {
      alert("Datas inválidas!");
      return;
    }

    if (moment(startDate).isAfter(endDate)) {
      alert("A data de término deve ser posterior à data de início!");
      return;
    }

    onSubmit({
      ...formData,
      startDate,
      endDate,
      tags: formData.tags,
    });
  };

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      await remove(ref(db, `calendar/tasks/${selectedTask.id}`));
      onClose();
    }
  };

  const handleConfirmCompletion = async () => {
    if (window.confirm("Deseja realmente marcar esta tarefa como concluída?")) {
      const updates = {
        status: "concluida",
        updatedAt: new Date().toISOString(),
        editHistory: [
          ...selectedTask.editHistory,
          {
            user: authUser.email,
            timestamp: new Date().toISOString(),
            changes: {
              status: { from: selectedTask.status, to: "concluida" },
            },
          },
        ],
      };

      await update(ref(db, `calendar/tasks/${selectedTask.id}`), updates);
      onClose();
    }
  };

  const handleSavePayment = async () => {
    if (!formData.paymentAmount || !formData.paymentDate) {
      alert("Por favor, preencha os dados obrigatórios do pagamento!");
      return;
    }

    const paymentUpdates = {
      payment: {
        description: formData.paymentDescription,
        amount: formData.paymentAmount,
        date: `${formData.paymentDate}T${formData.paymentTime || "00:00"}:00`,
      },
      paymentStatus: "pago",
      updatedAt: new Date().toISOString(),
      editHistory: [
        ...selectedTask.editHistory,
        {
          user: authUser.email,
          timestamp: new Date().toISOString(),
          changes: {
            payment: {
              from: selectedTask.payment || {},
              to: {
                description: formData.paymentDescription,
                amount: formData.paymentAmount,
                date: `${formData.paymentDate}T${formData.paymentTime || "00:00"}:00`,
              },
            },
          },
        },
      ],
    };

    await update(ref(db, `calendar/tasks/${selectedTask.id}`), paymentUpdates);
    onClose();
  };

  const translateField = (field) => {
    const translations = {
      title: "Título",
      description: "Descrição",
      startDate: "Data de início",
      endDate: "Data de término",
      assignedTo: "Técnicos",
      status: "Status",
      tags: "Tags",
      payment: "Pagamento",
    };
    return translations[field] || field;
  };

  if (!isOpen) return null;



  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 sticky top-0 flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-white text-2xl font-bold">
              {selectedTask ? `Tarefa #${selectedTask.taskId} - ${selectedTask.title}` : "Nova Tarefa"}
            </h2>
            {selectedTask && (
              <>
                <span
                  className={`ml-2 px-2 py-1 rounded text-sm ${selectedTask.status === "concluida"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                    }`}
                >
                  {selectedTask.status === "concluida"
                    ? "Concluída"
                    : "Pendente"}
                </span>
                {selectedTask.paymentStatus === "pago" && (
                  <span className="ml-2 px-2 py-1 rounded text-sm bg-blue-500">
                    Pago
                  </span>
                )}
              </>
            )}
          </div>          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-3xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-4">
          {isEditMode || !selectedTask ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Data Início *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Hora Início *
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Data Término *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Hora Término *
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Técnicos Responsáveis
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentTechnician}
                    onChange={(e) => setCurrentTechnician(e.target.value)}
                    className="flex-1 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite o nome do técnico"
                  />
                  <button
                    type="button"
                    onClick={handleAddTechnician}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Adicionar
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.assignedTo.map((name, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-md text-sm bg-gray-200 flex items-center gap-1"
                    >
                      {name}
                      <button
                        type="button"
                        onClick={() => handleRemoveTechnician(name)}
                        className="ml-1 text-xs hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {userTags.map((tag) => {
                    console.log("Renderizando tag:", tag); // Depuração
                    return (
                      <label key={tag.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.tags.includes(tag.id)}
                          onChange={(e) => {
                            const newTags = e.target.checked
                              ? [...formData.tags, tag.id]
                              : formData.tags.filter((t) => t !== tag.id);
                            console.log("Novas tags selecionadas:", newTags); // Depuração
                            setFormData({ ...formData, tags: newTags });
                          }}
                          className="hidden"
                        />
                        <span
                          className={`px-3 py-1 rounded-md text-sm cursor-pointer ${formData.tags.includes(tag.id) ? "opacity-100" : "opacity-50 hover:opacity-75"
                            }`}
                          style={{
                            backgroundColor: tag.color,
                            color: "#ffffff" // Texto branco para contraste
                          }}
                        >
                          {tag.name}
                        </span>
                      </label>
                    );
                  })}
                </div>              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {selectedTask ? "Salvar Alterações" : "Criar Tarefa"}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {selectedTask?.status === "concluida" &&
                userRole === "usuario comum" && (
                  <div className="space-y-4">
                    {isEditingPayment ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Valor do Pagamento *
                          </label>
                          <input
                            type="number"
                            value={formData.paymentAmount}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                paymentAmount: e.target.value,
                              })
                            }
                            className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Data do Pagamento *
                          </label>
                          <input
                            type="date"
                            value={formData.paymentDate}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                paymentDate: e.target.value,
                              })
                            }
                            className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Hora do Pagamento
                          </label>
                          <input
                            type="time"
                            value={formData.paymentTime}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                paymentTime: e.target.value,
                              })
                            }
                            className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Descrição do Pagamento
                          </label>
                          <textarea
                            value={formData.paymentDescription}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                paymentDescription: e.target.value,
                              })
                            }
                            className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            rows="3"
                          />
                        </div>

                        <button
                          onClick={handleSavePayment}
                          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Salvar Pagamento
                        </button>
                      </>
                    ) : (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Informações de Pagamento
                          <button
                            onClick={() => setIsEditingPayment(true)}
                            className="ml-2 text-sm text-blue-500 hover:text-blue-700"
                          >
                            {selectedTask.payment ? "Editar" : "Adicionar"}
                          </button>
                        </h3>
                        {selectedTask.payment && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-600">
                                Valor
                              </label>
                              <p className="mt-1 rounded">
                                R$ {selectedTask.payment.amount}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600">
                                Data
                              </label>
                              <p className="mt-1 rounded">
                                {moment(selectedTask.payment.date).format(
                                  "DD/MM/YYYY HH:mm"
                                )}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <label className="block text-sm font-medium text-gray-600">
                                Descrição do pagamento
                              </label>
                              <p className="mt-1 rounded">
                                {selectedTask.payment.description ||
                                  "Sem descrição"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Descrição da tarefa
                </label>
                <p className="mt-1 rounded">
                  {selectedTask.description || "Sem descrição"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Início
                  </label>
                  <p className="mt-1 rounded">
                    {moment(selectedTask.startDate).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Término
                  </label>
                  <p className="mt-1 rounded">
                    {moment(selectedTask.endDate).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>
              </div>

              {formData.assignedTo.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Técnicos
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.assignedTo.map((name, index) => (
                      <div
                        key={index}
                        className="p-2 bg-gray-100 rounded"
                      >
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Criado por
                  </label>
                  <p className="text-sm mt-1 rounded text-nowrap">
                    {users.find((u) => u.uid === selectedTask.createdByUid)
                      ?.email || selectedTask.createdBy}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Data de criação
                  </label>
                  <p className="mt-1 rounded">
                    {moment(selectedTask.createdAt).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Histórico de Alterações
                </label>
                <div className="mt-2 space-y-2">
                  {selectedTask.editHistory?.map((entry, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded">
                      <div className="text-xs text-gray-600">
                        {moment(entry.timestamp).format("DD/MM/YYYY HH:mm")} -{" "}
                        {entry.user}
                      </div>
                      {Object.entries(entry.changes).map(([field, change]) => {
                        // Função para formatar valores complexos
                        const formatValue = (value) => {
                          if (field === 'payment') {
                            if (!value) return 'Nenhum pagamento';
                            return `Valor: ${value.amount || ''}, Data: ${value.date ? moment(value.date).format('DD/MM/YYYY HH:mm') : ''}, Descrição: ${value.description || ''}`;
                          }
                          if (field === 'paymentStatus') {
                            return value === 'pago' ? 'pago' : 'pendente';
                          }
                          return value;
                        };

                        return (
                          <div key={field} className="text-xs mt-1">
                            {translateField(field)} alterado:
                            <span className="line-through text-red-500 mx-1">
                              "{formatValue(change.from)}"
                            </span>
                            →
                            <span className="text-green-600">
                              "{formatValue(change.to)}"
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                {(userRole === "administrador" ||
                  currentUser.uid === selectedTask.createdByUid) && (
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Excluir
                    </button>
                  )}

                {selectedTask.status === "pendente" &&
                  currentUser.uid === selectedTask.createdByUid && (
                    <button
                      onClick={handleConfirmCompletion}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Concluir
                    </button>
                  )}

                {(userRole === "administrador" ||
                  currentUser.uid === selectedTask.createdByUid) && (
                    <button
                      onClick={() => setIsEditMode(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Editar
                    </button>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;