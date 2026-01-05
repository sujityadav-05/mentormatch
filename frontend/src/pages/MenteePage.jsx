import { MentorSearchFilter } from "../components/MentorSearchFilter";

const MenteePage = () => {
  return (
    <div className="mx-auto bg-base-100 p-6 rounded-lg shadow-lg min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <h2 className="text-2xl font-semibold text-primary mb-6">Find Your Mentor</h2>
      <MentorSearchFilter />
    </div>
  );
};

export default MenteePage;