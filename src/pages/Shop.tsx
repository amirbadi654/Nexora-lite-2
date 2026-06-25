import React, { useState, useEffect } from 'react';
import { Zap, Star, Check, X, Loader2, Link2, AlertTriangle } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useGame } from '../context/GameContext';

type ModalState = 'idle' | 'confirm' | 'loading' | 'success' | 'error';
type ItemType = 'booster' | 'premium';

interface ShopItem { type: ItemType; name: string; price: string; description: string; }

const ITEMS: Record<ItemType, ShopItem> = {
  booster: { type: 'booster', name: 'XP Booster', price: '0.01', description: 'Earn 1.5x XP on all challenges for 24 hours' },
  premium: { type: 'premium', name: 'Premium Pass', price: '0.05', description: 'Unlock premium status across the entire platform' },
};

const PurchaseModal: React.FC<{ item: ShopItem; state: ModalState; error: string; onClose: () => void; onConfirm: () => void; }> = ({ item, state, error, onClose, onConfirm }) => {
  if (state === 'idle') return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadein" style={{ background: 'rgba(15,23,42,0.9)' }} onClick={state === 'loading' ? undefined : onClose}>
      <div className="bg-card rounded-2xl p-6 max-w-sm w-full border border-secondary-layer" onClick={(e) => e.stopPropagation()}>
        {state === 'confirm' && (
          <>
            <h3 className="text-xl font-bold text-text-primary mb-1">Confirm Purchase</h3>
            <p className="text-sm text-text-secondary mb-5">Review your transaction details below.</p>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center bg-secondary-layer rounded-lg px-4 py-3"><span className="text-text-secondary text-sm">Item</span><span className="text-text-primary font-semibold">{item.name}</span></div>
              <div className="flex justify-between items-center bg-secondary-layer rounded-lg px-4 py-3"><span className="text-text-secondary text-sm">Price</span><span className="text-gold font-bold">{item.price} RITUAL</span></div>
              <div className="flex justify-between items-center bg-secondary-layer rounded-lg px-4 py-3"><span className="text-text-secondary text-sm">Network</span><span className="text-interactive-cyan font-medium">Ritual Testnet</span></div>
              <div className="flex justify-between items-center bg-secondary-layer rounded-lg px-4 py-3"><span className="text-text-secondary text-sm">Recipient</span><span className="text-text-primary font-mono text-xs">Platform fee address</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={onConfirm} className="flex-1 py-3 bg-brand-purple hover:bg-brand-purple/80 text-white rounded-lg font-semibold transition-colors">Confirm Purchase</button>
              <button onClick={onClose} className="px-5 py-3 border border-secondary-layer text-text-secondary rounded-lg font-semibold hover:bg-secondary-layer transition-colors">Cancel</button>
            </div>
          </>
        )}
        {state === 'loading' && (
          <div className="text-center py-8">
            <Loader2 size={48} className="text-brand-purple mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-bold text-text-primary mb-1">Processing...</h3>
            <p className="text-sm text-text-secondary">Waiting for wallet confirmation...</p>
          </div>
        )}
        {state === 'success' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-success-emerald/20 flex items-center justify-center mx-auto mb-4 animate-pop"><Check size={36} className="text-success-emerald" /></div>
            <h3 className="text-lg font-bold text-text-primary mb-1">Purchase Successful!</h3>
            <p className="text-sm text-text-secondary mb-6">{item.name} added to your account.</p>
            <button onClick={onClose} className="px-6 py-2.5 bg-brand-purple text-white rounded-lg font-semibold hover:bg-brand-purple/80 transition-colors">Done</button>
          </div>
        )}
        {state === 'error' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4"><X size={36} className="text-red-400" /></div>
            <h3 className="text-lg font-bold text-text-primary mb-1">Transaction Failed</h3>
            <p className="text-sm text-red-400 mb-6">{error || 'Something went wrong. Please try again.'}</p>
            <button onClick={onClose} className="px-6 py-2.5 bg-brand-purple text-white rounded-lg font-semibold hover:bg-brand-purple/80 transition-colors">Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

const Shop: React.FC = () => {
  const { isConnected, isRightNetwork, switchToRitual, purchaseItem } = useWallet();
  const { xpBoosterActive, xpBoosterExpiry, premiumStatus, activateBooster, purchasePremium } = useGame();
  const [modalState, setModalState] = useState<ModalState>('idle');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [error, setError] = useState('');
  const [boosterRemaining, setBoosterRemaining] = useState(0);

  useEffect(() => {
    if (!xpBoosterActive || !xpBoosterExpiry) return;
    const tick = () => setBoosterRemaining(Math.max(0, xpBoosterExpiry - Date.now()));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [xpBoosterActive, xpBoosterExpiry]);

  const formatBoosterTime = (ms: number) => {
    const totalMin = Math.floor(ms / 60000);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${h}h ${m}m`;
  };

  const handleBuy = (item: ShopItem) => {
    if (!isConnected || !isRightNetwork) return;
    setSelectedItem(item);
    setModalState('confirm');
  };

  const handleConfirm = async () => {
    if (!selectedItem) return;
    setModalState('loading');
    setError('');
    try {
      const { txHash } = await purchaseItem(selectedItem.price, selectedItem.name);
      if (selectedItem.type === 'booster') activateBooster(24 * 60 * 60 * 1000, txHash);
      else purchasePremium(txHash);
      setModalState('success');
    } catch (err: any) {
      setError(err?.message || 'Transaction was rejected or failed.');
      setModalState('error');
    }
  };

  const closeModal = () => { setModalState('idle'); setSelectedItem(null); setError(''); };

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-1">Shop</h1>
            <p className="text-text-secondary">Enhance your Nexora experience with RITUAL</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold self-start" style={{ background: '#38BDF822', color: '#38BDF8' }}>
            <Link2 size={12} /> Ritual Testnet
          </span>
        </div>

        {isConnected && !isRightNetwork && (
          <div className="flex items-center justify-between gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-400" />
              <span className="text-sm text-red-400 font-medium">Wrong network. Please switch to Ritual Network.</span>
            </div>
            <button onClick={switchToRitual} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-colors">Switch to Ritual</button>
          </div>
        )}

        {!isConnected && (
          <div className="bg-card rounded-xl p-8 text-center mb-6">
            <p className="text-text-secondary">Connect your wallet to view and purchase items.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* XP Booster */}
          <div className="bg-card rounded-2xl p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: '#FBBF2422' }}><Zap size={28} className="text-gold" /></div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary-layer text-text-secondary">24 Hours</span>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-1">XP Booster</h3>
            <p className="text-sm text-text-secondary mb-4">{ITEMS.booster.description}</p>
            <ul className="space-y-2 mb-5">
              {['1.5x XP multiplier', 'Valid for 24 hours', 'Works on all categories'].map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-text-primary"><Check size={16} className="text-success-emerald" /> {b}</li>
              ))}
            </ul>
            <div className="flex items-center justify-between mb-4"><span className="text-2xl font-bold text-gold">0.01 RITUAL</span></div>
            {xpBoosterActive ? (
              <button disabled className="w-full py-3 rounded-lg font-semibold text-white" style={{ background: '#10B981' }}>Active — {formatBoosterTime(boosterRemaining)} remaining</button>
            ) : (
              <button onClick={() => handleBuy(ITEMS.booster)} disabled={!isConnected || !isRightNetwork} className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" style={{ background: '#8B5CF6' }}>Buy Now</button>
            )}
          </div>

          {/* Premium Pass */}
          <div className="bg-card rounded-2xl p-6 relative">
            <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-bg-primary" style={{ background: '#FBBF24' }}>MOST POPULAR</span>
            <div className="flex items-start mb-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: '#FBBF2422' }}><Star size={28} className="text-gold" fill="currentColor" /></div>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-1">Premium Pass</h3>
            <p className="text-sm text-text-secondary mb-4">{ITEMS.premium.description}</p>
            <ul className="space-y-2 mb-5">
              {['Premium badge on profile', 'Special display in Leaderboard', 'Premium account status', 'Permanent upgrade'].map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-text-primary"><Check size={16} className="text-success-emerald" /> {b}</li>
              ))}
            </ul>
            <div className="flex items-center justify-between mb-4"><span className="text-2xl font-bold text-gold">0.05 RITUAL</span></div>
            {premiumStatus ? (
              <button disabled className="w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2" style={{ background: '#10B981' }}><Check size={18} /> Active</button>
            ) : (
              <button onClick={() => handleBuy(ITEMS.premium)} disabled={!isConnected || !isRightNetwork} className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" style={{ background: 'linear-gradient(135deg, #8B5CF6, #FBBF24)' }}>Buy Premium</button>
            )}
          </div>
        </div>
      </div>
      <PurchaseModal item={selectedItem || ITEMS.booster} state={modalState} error={error} onClose={closeModal} onConfirm={handleConfirm} />
    </div>
  );
};

export default Shop;
