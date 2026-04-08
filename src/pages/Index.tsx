import { useDarkMode } from "@/hooks/useDarkMode";
import WallScene from "@/components/WallScene";
import WallCalendar from "@/components/WallCalendar";

const Index = () => {
  const { isDark } = useDarkMode();

  return (
    <WallScene isDark={isDark}>
      <div className="float-subtle">
        <WallCalendar />
      </div>
    </WallScene>
  );
};

export default Index;
