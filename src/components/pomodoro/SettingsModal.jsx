import { useState } from "react";
import { X } from "lucide-react";

const SettingsModal = ({ isOpen, onClose, onSave, currentSettings }) => {
  const [settings, setSettings] = useState(currentSettings);

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: parseInt(value) }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Configurações</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="pomodoro" className="block text-sm font-semibold text-slate-700 mb-1.5">Foco (minutos)</label>
            <input id="pomodoro" name="pomodoro" type="number" value={settings.pomodoro} onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg"/>
          </div>
          <div>
            <label htmlFor="shortBreak" className="block text-sm font-semibold text-slate-700 mb-1.5">Pausa Curta (minutos)</label>
            <input id="shortBreak" name="shortBreak" type="number" value={settings.shortBreak} onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg"/>
          </div>
          <div>
            <label htmlFor="longBreak" className="block text-sm font-semibold text-slate-700 mb-1.5">Pausa Longa (minutos)</label>
            <input id="longBreak" name="longBreak" type="number" value={settings.longBreak} onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg"/>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-6 mt-4">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">Cancelar</button>
          <button onClick={handleSave} className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;