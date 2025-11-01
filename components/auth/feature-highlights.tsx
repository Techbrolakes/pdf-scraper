import { LightningIcon, ShieldCheckIcon, LightBulbIcon } from '@/components/icons';

export function FeatureHighlights() {
  return (
    <div className="mt-12 grid grid-cols-3 gap-6 text-center">
      <div className="space-y-2">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 text-blue-400">
          <LightningIcon className="w-5 h-5" />
        </div>
        <p className="text-xs text-gray-400 font-medium">Lightning Fast</p>
      </div>
      <div className="space-y-2">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10 text-green-400">
          <ShieldCheckIcon className="w-5 h-5" />
        </div>
        <p className="text-xs text-gray-400 font-medium">Secure & Private</p>
      </div>
      <div className="space-y-2">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/10 text-purple-400">
          <LightBulbIcon className="w-5 h-5" />
        </div>
        <p className="text-xs text-gray-400 font-medium">AI-Powered</p>
      </div>
    </div>
  );
}
