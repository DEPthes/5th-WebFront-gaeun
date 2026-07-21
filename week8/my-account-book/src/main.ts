// 1. 타입 정의
type TransactionType = 'income' | 'expense';

interface Transaction {
  id: number;
  type: TransactionType;
  description: string;
  amount: number;
}

// 2. Class 문법 적용
class Ledger {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public addTransaction(transaction: Transaction): void {
    this.transactions.push(transaction);
  }

  // ID를 이용한 내역 삭제 메서드
  public deleteTransaction(id: number): void {
    this.transactions = this.transactions.filter(t => t.id !== id);
  }

  public getTransactions(): Transaction[] {
    return this.transactions;
  }

  public getTotalIncome(): number {
    return this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  public getTotalExpense(): number {
    return this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  public getBalance(): number {
    return this.getTotalIncome() - this.getTotalExpense();
  }
}

const myLedger = new Ledger();

// 3. DOM 요소 가져오기
const form = document.getElementById('ledger-form') as HTMLFormElement;
const typeInput = document.getElementById('type') as HTMLSelectElement;
const descriptionInput = document.getElementById('description') as HTMLInputElement;
const amountInput = document.getElementById('amount') as HTMLInputElement;

const totalIncomeEl = document.getElementById('total-income') as HTMLElement;
const totalExpenseEl = document.getElementById('total-expense') as HTMLElement;
const totalBalanceEl = document.getElementById('total-balance') as HTMLElement;
const transactionListEl = document.getElementById('transaction-list') as HTMLUListElement;
const errorBoxEl = document.getElementById('error-message') as HTMLDivElement;

// 4. 에러 처리 함수
function showError(message: string): void {
  errorBoxEl.textContent = message;
  errorBoxEl.style.display = 'block';
}

function clearError(): void {
  errorBoxEl.textContent = '';
  errorBoxEl.style.display = 'none';
}

// 5. 대시보드 업데이트
function updateDashboard(): void {
  const totalIncome = myLedger.getTotalIncome();
  const totalExpense = myLedger.getTotalExpense();
  const currentBalance = myLedger.getBalance();

  totalIncomeEl.textContent = `${totalIncome.toLocaleString()}원`;
  totalExpenseEl.textContent = `${totalExpense.toLocaleString()}원`;
  totalBalanceEl.textContent = `${currentBalance.toLocaleString()}원`;
}

// 6. 리스트 렌더링
function renderList(): void {
  transactionListEl.innerHTML = '';

  myLedger.getTransactions().map(t => {
    const li = document.createElement('li');
    li.className = 'transaction-item';

    const typeSign = t.type === 'income' ? '+' : '-';
    const amountClass = t.type === 'income' ? 'income' : 'expense';

    // 내역 정보 레이아웃
    const infoSpan = document.createElement('span');
    infoSpan.className = 'item-desc';
    infoSpan.textContent = t.description;

    // 금액 및 삭제 버튼을 감싸는 우측 영역
    const rightDiv = document.createElement('div');
    rightDiv.style.display = 'flex';
    rightDiv.style.alignItems = 'center';
    rightDiv.style.gap = '1rem';

    const amountSpan = document.createElement('span');
    amountSpan.className = `item-amount ${amountClass}`;
    amountSpan.textContent = `${typeSign}${t.amount.toLocaleString()}원`;

    // 삭제 버튼 생성 및 스타일링 (X 버튼으로 변경)
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✕';
    
    deleteBtn.style.background = 'none';
    deleteBtn.style.border = 'none';
    deleteBtn.style.color = 'var(--color-text-muted)';
    deleteBtn.style.fontSize = '1rem';
    deleteBtn.style.fontWeight = 'bold';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.padding = '0 0.25rem';
    deleteBtn.style.transition = 'color 0.2s, transform 0.2s';

    // 마우스를 올렸을 때 효과
    deleteBtn.addEventListener('mouseenter', () => {
      deleteBtn.style.color = 'var(--color-expense-text)';
      deleteBtn.style.transform = 'scale(1.2)';
    });

    // 마우스가 떠났을 때 효과
    deleteBtn.addEventListener('mouseleave', () => {
      deleteBtn.style.color = 'var(--color-text-muted)';
      deleteBtn.style.transform = 'scale(1)';
    });

    // 삭제 버튼 클릭 시 동작하는 이벤트 
    deleteBtn.addEventListener('click', () => {
      myLedger.deleteTransaction(t.id);
      updateDashboard();
      renderList();
    });

    rightDiv.appendChild(amountSpan);
    rightDiv.appendChild(deleteBtn);

    li.appendChild(infoSpan);
    li.appendChild(rightDiv);
    
    transactionListEl.appendChild(li);
  });
}

// 7. 폼 제출 이벤트 핸들러
form.addEventListener('submit', (e: Event) => {
  e.preventDefault();
  clearError();

  const type = typeInput.value as TransactionType;
  const description = descriptionInput.value.trim();
  const amount = Number(amountInput.value);

  if (description === '') {
    showError('오류: 내역 문자가 비어 있습니다. 올바른 내역을 입력해주세요.');
    return;
  }

  if (description.length > 20) {
    showError('오류: 내역이 너무 깁니다. 20자 이하로 작성해 주세요.');
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    showError('오류: 금액은 0원보다 큰 올바른 숫자여야 합니다.');
    return;
  }

  const newTransaction: Transaction = {
    id: Date.now(),
    type,
    description,
    amount
  };

  myLedger.addTransaction(newTransaction);
  updateDashboard();
  renderList();

  descriptionInput.value = '';
  amountInput.value = '';
});