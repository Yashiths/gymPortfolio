import { useState } from 'react';
import { useGym } from '../../context/useGym';
import { 
  Laptop, 
  Tablet, 
  Smartphone, 
  Save, 
  AlertCircle, 
  Check, 
  X,
  FileEdit,
  Globe,
  Plus,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import landing sections to render directly in the editable canvas
import Hero from '../Hero';
import About from '../About';
import Pricing from '../Pricing';

export default function PageEditor() {
  const { landingData, updateLandingData, changeView, transformations, addTransformation, deleteTransformation } = useGym();
  
  // Local state for editing drafts
  const [draftData, setDraftData] = useState(() => JSON.parse(JSON.stringify(landingData)));
  const [viewportSize, setViewportSize] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Field edit modal states
  const [editingField, setEditingField] = useState(null); // { path: string[], label: string, value: string, maxChars: number }
  const [editValue, setEditValue] = useState('');

  // New Transformation Form State
  const [showTransForm, setShowTransForm] = useState(false);
  const [newTrans, setNewTrans] = useState({
    clientName: '', programName: '', duration: '', beforeImageUrl: '', afterImageUrl: '',
    metrics: { weightBefore: '', weightAfter: '', fatLoss: '' }
  });

  const handleAddTransformation = async (e) => {
    e.preventDefault();
    await addTransformation(newTrans);
    setNewTrans({
      clientName: '', programName: '', duration: '', beforeImageUrl: '', afterImageUrl: '',
      metrics: { weightBefore: '', weightAfter: '', fatLoss: '' }
    });
    setShowTransForm(false);
  };

  // Check if draft matches context data to flag "Save & Publish" active
  const isDirty = JSON.stringify(draftData) !== JSON.stringify(landingData);

  // Click handler triggered from editable fields in preview
  const handleEditField = (path, label, maxChars) => {
    // Traverse object to find value
    let val = draftData;
    for (const key of path) {
      val = val[key];
    }
    setEditingField({ path, label, maxChars });
    setEditValue(val || '');
  };

  const handleApplyChanges = (e) => {
    if (e) e.preventDefault();
    if (!editingField) return;

    if (editValue.length > editingField.maxChars) return; // validate char limit

    const updated = JSON.parse(JSON.stringify(draftData));
    
    // Set value at path dynamically
    let ref = updated;
    const path = editingField.path;
    for (let i = 0; i < path.length - 1; i++) {
      ref = ref[path[i]];
    }
    ref[path[path.length - 1]] = editValue;

    setDraftData(updated);
    setEditingField(null);
    setEditValue('');
  };

  const handlePublish = () => {
    updateLandingData(draftData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Helper values for simulated viewports
  const viewportWidths = {
    desktop: 'w-full',
    tablet: 'max-w-2xl border-x border-white/10 rounded-[32px] my-6',
    mobile: 'max-w-xs border-x border-white/10 rounded-[40px] my-8'
  };

  return (
    <div className="space-y-6 relative min-h-screen pb-24">
      
      {/* CMS Workspace Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-2.5">
            <FileEdit className="text-brand-cyan w-7 h-7" />
            Page Editor <span className="text-gray-500 font-sans text-sm font-normal normal-case"> (Visual CMS)</span>
          </h2>
          <p className="text-gray-400 text-sm mt-0.5">Click directly on any cyan-outlined text inside the preview canvas to edit.</p>
        </div>

        {/* Viewport Size Controls & Actions */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center bg-black/40 border border-white/10 p-1 rounded-xl">
            <button
              onClick={() => setViewportSize('desktop')}
              className={`p-2 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewportSize === 'desktop' ? 'bg-brand-cyan text-black' : 'text-gray-400 hover:text-white'
              }`}
              title="Desktop Mode"
            >
              <Laptop className="w-4 h-4" />
              Desktop
            </button>
            <button
              onClick={() => setViewportSize('tablet')}
              className={`p-2 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewportSize === 'tablet' ? 'bg-brand-cyan text-black' : 'text-gray-400 hover:text-white'
              }`}
              title="Tablet Mode"
            >
              <Tablet className="w-4 h-4" />
              Tablet
            </button>
            <button
              onClick={() => setViewportSize('mobile')}
              className={`p-2 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewportSize === 'mobile' ? 'bg-brand-cyan text-black' : 'text-gray-400 hover:text-white'
              }`}
              title="Mobile Mode"
            >
              <Smartphone className="w-4 h-4" />
              Mobile
            </button>
          </div>

          <button
            onClick={() => changeView('landing')}
            className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Globe className="w-4 h-4" />
            View Live Site
          </button>
        </div>
      </div>

      {/* Preview Device Wrapper */}
      <div className="w-full flex justify-center bg-black/20 p-2 md:p-6 rounded-3xl border border-white/5 relative overflow-hidden">
        
        {/* Device frame visual bezels */}
        <div className={`transition-all duration-500 bg-[#090d16] ${viewportWidths[viewportSize]} relative shadow-2xl overflow-hidden min-h-[500px]`}>
          
          {/* Simulated Mobile/Tablet Header speaker and camera bezel details */}
          {viewportSize !== 'desktop' && (
            <div className="absolute top-0 left-0 right-0 h-6 bg-black/40 border-b border-white/5 flex justify-center items-center gap-2 z-30 pointer-events-none">
              <div className="w-12 h-3 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            </div>
          )}

          {/* Scaled Preview Canvas Wrapper */}
          <div className={`${viewportSize !== 'desktop' ? 'pt-6 h-[720px] overflow-y-auto' : ''} relative no-scrollbar`}>
            
            {/* Overlay shield indicating this is an editable canvas */}
            <div className="absolute inset-0 bg-transparent pointer-events-none z-10" />

            {/* Landing components in CMS mode */}
            <Hero 
              isEditing={true} 
              data={draftData.hero} 
              onEditField={(path, label, max) => handleEditField(['hero', ...path], label, max)} 
            />
            <About 
              isEditing={true} 
              data={draftData.about} 
              onEditField={(path, label, max) => handleEditField(['about', ...path], label, max)} 
            />
            <Pricing 
              isEditing={true} 
              data={draftData.pricing} 
              onEditField={(path, label, max) => handleEditField(['pricing', ...path], label, max)} 
            />
          </div>
        </div>
      </div>

      {/* Floating Save Bar */}
      <AnimatePresence>
        {isDirty && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-[#111827]/90 border border-brand-orange/40 hover:border-brand-orange shadow-[0_0_30px_rgba(255,157,0,0.2)] py-4 px-6 sm:px-8 rounded-2xl backdrop-blur-md flex items-center justify-between gap-8 max-w-xl w-[90%]"
          >
            <div>
              <p className="text-white text-sm font-bold uppercase">Pending CMS Edits</p>
              <p className="text-[10px] text-gray-400">Save changes to publish them to the live public site.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDraftData(JSON.parse(JSON.stringify(landingData)))}
                className="px-4 py-2 border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer"
              >
                Discard
              </button>
              <button
                onClick={handlePublish}
                className="px-5 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-orange transition-all"
              >
                <Save className="w-4 h-4" />
                Publish Changes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Publish Success Toast */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#111827] border border-green-500/30 text-green-400 rounded-2xl py-3.5 px-6 font-bold uppercase text-xs tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.15)]"
          >
            <Check className="w-4 h-4 text-green-400" />
            Changes Published Successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Modal Overlay for Field Values */}
      <AnimatePresence>
        {editingField && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingField(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#0c1220] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl z-10 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-brand-cyan tracking-wider">CMS Editor Panel</span>
                  <h3 className="text-lg font-display font-bold uppercase tracking-wider text-white">Edit {editingField.label}</h3>
                </div>
                <button
                  onClick={() => setEditingField(null)}
                  className="p-1.5 border border-white/10 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleApplyChanges} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold uppercase">
                    <span>Input Content</span>
                    <span className={editValue.length > editingField.maxChars ? 'text-red-500' : 'text-gray-400'}>
                      {editValue.length} / {editingField.maxChars} chars max
                    </span>
                  </div>

                  {editingField.maxChars > 80 ? (
                    <textarea
                      rows={4}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className={`w-full px-4 py-3 bg-black/40 border rounded-xl text-sm focus:outline-none focus:border-brand-cyan/60 text-white transition-colors leading-relaxed ${
                        editValue.length > editingField.maxChars ? 'border-red-500/50' : 'border-white/10'
                      }`}
                      placeholder={`Enter ${editingField.label.toLowerCase()}...`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className={`w-full px-4 py-3 bg-black/40 border rounded-xl text-sm focus:outline-none focus:border-brand-cyan/60 text-white transition-colors font-semibold ${
                        editValue.length > editingField.maxChars ? 'border-red-500/50' : 'border-white/10'
                      }`}
                      placeholder={`Enter ${editingField.label.toLowerCase()}...`}
                    />
                  )}

                  {/* Character count warning */}
                  {editValue.length > editingField.maxChars && (
                    <p className="text-[11px] text-red-400 flex items-center gap-1.5 font-semibold mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Character limit exceeded. Please shorten the text to save changes.
                    </p>
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingField(null)}
                    className="px-4.5 py-2.5 border border-white/10 hover:bg-white/5 rounded-xl text-xs font-bold uppercase text-gray-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editValue.length > editingField.maxChars}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                      editValue.length > editingField.maxChars
                        ? 'bg-white/5 border border-white/5 text-gray-500 cursor-not-allowed'
                        : 'bg-brand-cyan hover:bg-brand-cyan-hover text-black shadow-cyan cursor-pointer'
                    }`}
                  >
                    Apply Draft
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transformations Management Section */}
      <div className="pt-12 mt-12 border-t border-white/5 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-display font-bold uppercase text-white">Manage Transformations</h3>
            <p className="text-gray-400 text-sm">Add or remove client success stories shown on the homepage.</p>
          </div>
          <button 
            onClick={() => setShowTransForm(true)}
            className="px-4 py-2 bg-brand-cyan hover:bg-brand-cyan-hover text-black font-bold text-xs uppercase rounded-xl flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Evolution
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transformations?.map(trans => (
            <div key={trans.id} className="glass-card p-4 rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={trans?.afterImageUrl} className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <p className="text-white font-bold text-sm uppercase">{trans?.clientName}</p>
                  <p className="text-gray-500 text-[10px] uppercase">{trans?.programName}</p>
                </div>
              </div>
              <button 
                onClick={() => deleteTransformation(trans.id)}
                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Transformation Modal */}
      <AnimatePresence>
        {showTransForm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTransForm(false)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative w-full max-w-2xl bg-[#0c1220] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-display font-bold uppercase text-white">Add New Success Story</h3>
              <form onSubmit={handleAddTransformation} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <EditorInput label="Client Name" value={newTrans.clientName} onChange={v => setNewTrans({...newTrans, clientName: v})} />
                  <EditorInput label="Program Name" value={newTrans.programName} onChange={v => setNewTrans({...newTrans, programName: v})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <EditorInput label="Duration (e.g. 12 Weeks)" value={newTrans.duration} onChange={v => setNewTrans({...newTrans, duration: v})} />
                  <EditorInput label="Fat Loss %" value={newTrans.metrics.fatLoss} onChange={v => setNewTrans({...newTrans, metrics: {...newTrans.metrics, fatLoss: v}})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <EditorInput label="Before Weight" value={newTrans.metrics.weightBefore} onChange={v => setNewTrans({...newTrans, metrics: {...newTrans.metrics, weightBefore: v}})} />
                  <EditorInput label="After Weight" value={newTrans.metrics.weightAfter} onChange={v => setNewTrans({...newTrans, metrics: {...newTrans.metrics, weightAfter: v}})} />
                </div>
                <EditorInput label="Before Image URL" value={newTrans.beforeImageUrl} onChange={v => setNewTrans({...newTrans, beforeImageUrl: v})} icon={<ImageIcon className="w-3 h-3"/>} />
                <EditorInput label="After Image URL" value={newTrans.afterImageUrl} onChange={v => setNewTrans({...newTrans, afterImageUrl: v})} icon={<ImageIcon className="w-3 h-3"/>} />
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowTransForm(false)} className="px-6 py-3 text-gray-400 font-bold uppercase text-xs">Cancel</button>
                  <button type="submit" className="px-6 py-3 bg-brand-cyan text-black font-bold uppercase text-xs rounded-xl shadow-cyan">Save Transformation</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EditorInput({ label, value, onChange, icon }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">{icon}{label}</label>
      <input 
        type="text" 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-cyan transition-colors" 
      />
    </div>
  );
}
