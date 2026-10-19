import { Container } from '@/components/common/container';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <div className="flex justify-center items-center gap-2 py-5 text-sm font-normal text-muted-foreground">
          <span>{currentYear} &copy;</span>
          <span className="text-secondary-foreground">Cine</span>
        </div>
      </Container>
    </footer>
  );
}
