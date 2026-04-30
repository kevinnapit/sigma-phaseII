import { AuthRepositoryMock } from '$lib/data/repositories/auth.repository.mock';
import { AuthUseCase } from '$lib/domain/usecases/auth.usecase';
import { EmployeeRepositoryImpl } from '$lib/data/repositories/hrm';
import { EmployeeUseCase } from '$lib/domain/usecases/hrm';

const authRepository = new AuthRepositoryMock();
const employeeRepository = new EmployeeRepositoryImpl();

export const authUseCase = new AuthUseCase(authRepository);
export const employeeUseCase = new EmployeeUseCase(employeeRepository);

export const container = {
	authUseCase,
	employeeUseCase
} as const;
