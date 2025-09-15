import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TexGenerationErrorProps {
  error: string;
  onRetry: () => void;
  isLoading: boolean;
}

export function TexGenerationError({ error, onRetry, isLoading }: TexGenerationErrorProps) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            エラー: {error}
          </div>
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            再試行
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}