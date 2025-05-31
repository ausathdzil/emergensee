import { EpidemiologyMap } from './epidemiology-map';

export default function Epidemiology() {
  // const symptomsAndLocations = await getSymptomsAndLocations();

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border p-4">
        <h1 className="text-center text-xl font-semibold">Peta Epidemiologi</h1>
      </header>
      <main className="flex-1 p-8 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
        <EpidemiologyMap />
      </main>
    </div>
  );
}
