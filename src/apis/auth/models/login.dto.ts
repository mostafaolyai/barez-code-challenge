import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'username',
    type: String,
    description: "this is a test of username's description",
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'password',
    type: String,
    description: "this is a test of password's description",
  })
  password: string;
}
